// ==UserScript==
// @name         Omni (GreasyFork loader)
// @name:tr      Omni (GreasyFork yükleyici)
// @namespace    omni-loader
// @version      1.4
// @description  Loads Omni for Gartic.io. This file is only a loader: it fetches the current build and injects it into the page. No game code lives here.
// @description:tr Gartic.io için Omni eklenti platformu yükleyicisi. Bu dosya yalnızca yükleyicidir: güncel sürümü indirip sayfaya enjekte eder.
// @license      MIT
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @noframes
// ==/UserScript==

// Omni GreasyFork loader — intentionally plain and readable.
// GreasyFork forbids obfuscated scripts, so this loader carries no game
// code at all: it downloads the current Omni build and injects it into
// page scope (the game must run there, not in the sandbox).
// Before injecting, the download must contain the runner marker;
// anything else (error pages, truncated files) is discarded and retried.
// The build URL below always serves the latest release.

(function () {
    'use strict';

    // Public build. Never points anywhere else.
    var BUILD_URL = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/aetherial/omni/voyager/voyager.user.js';

    // Page scope only.
    if (window.top !== window.self) return;

    // The build always carries its runner. Anything without the marker
    // is not a build (error page, truncated download) — refuse it.
    function looksLikeBuild(src) {
        return src.indexOf('ForgeScript') !== -1;
    }

    // Strip a ==UserScript== header block so only code is injected.
    function stripHeader(src) {
        var start = src.indexOf('// ==UserScript==');
        if (start === -1) return src;
        var end = src.indexOf('// ==/UserScript==', start);
        if (end === -1) return src;
        return src.slice(0, start) + src.slice(end + '// ==/UserScript=='.length);
    }

    function inject(code) {
        var root = document.documentElement;
        if (!root) return false;
        var s = document.createElement('script');
        s.textContent = code;
        root.appendChild(s);
        // Keep the DOM clean; the code already ran.
        if (s.parentNode) s.parentNode.removeChild(s);
        return true;
    }

    function fetchBuild(url, done) {
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function (res) { done(res && res.responseText ? res.responseText : null); },
                    onerror: function () { done(null); },
                    ontimeout: function () { done(null); }
                });
                return;
            }
        } catch (e) { /* fall through to fetch */ }
        try {
            fetch(url).then(function (r) {
                return r.text();
            }).then(function (t) {
                done(t || null);
            }).catch(function () {
                done(null);
            });
        } catch (e) {
            done(null);
        }
    }

    var tried = 0;
    var HIDE_KEY = 'omni_gf_hide';

    function todayStr() {
        try {
            var d = new Date();
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        } catch (e) {
            return '';
        }
    }

    function hideUntilTomorrow() {
        try {
            localStorage.setItem(HIDE_KEY, todayStr());
        } catch (e) { /* private mode: show again next load */ }
    }

    function suppressedToday() {
        try {
            return localStorage.getItem(HIDE_KEY) === todayStr() && todayStr() !== '';
        } catch (e) {
            return false;
        }
    }

    // Small notice: GreasyFork copy is a loader, native build is faster.
    function showNotice() {
        try {
            if (suppressedToday()) return;
            if (!document.body) return;
            if (document.getElementById('omni-gf-note')) return;
            var box = document.createElement('div');
            box.id = 'omni-gf-note';
            box.setAttribute('style', 'position:fixed;right:12px;bottom:12px;z-index:2147483647;background:linear-gradient(160deg,#1e272e,#11181f);color:#f1f2f6;border:1px solid #57606f;border-radius:14px;padding:12px 14px;font:13px/1.45 Arial,sans-serif;max-width:260px;box-shadow:0 10px 28px rgba(0,0,0,.5);');
            var head = document.createElement('div');
            head.textContent = 'Omni';
            head.setAttribute('style', 'font-weight:bold;font-size:14px;margin-bottom:4px;letter-spacing:.3px;');
            box.appendChild(head);
            var msg = document.createElement('div');
            msg.textContent = 'This script does not give you full performance, please use the GitHub native version.';
            msg.setAttribute('style', 'opacity:.92;');
            box.appendChild(msg);
            var row = document.createElement('div');
            row.setAttribute('style', 'margin-top:10px;display:flex;gap:8px;align-items:center;');
            var go = document.createElement('button');
            go.textContent = 'Continue';
            go.setAttribute('style', 'flex:1;padding:7px 0;border:none;border-radius:8px;background:#0984e3;color:#fff;font:bold 12px Arial;cursor:pointer;');
            go.addEventListener('click', function () {
                window.location.href = BUILD_URL;
            });
            row.appendChild(go);
            var hide = document.createElement('button');
            hide.textContent = "Don't show today";
            hide.setAttribute('style', 'flex:1;padding:7px 0;border:1px solid #57606f;border-radius:8px;background:transparent;color:#dfe6e9;font:12px Arial;cursor:pointer;');
            hide.addEventListener('click', function () {
                hideUntilTomorrow();
                if (box.parentNode) box.parentNode.removeChild(box);
            });
            row.appendChild(hide);
            var x = document.createElement('button');
            x.textContent = '×';
            x.setAttribute('style', 'padding:7px 10px;border:1px solid #57606f;border-radius:8px;background:transparent;color:#dfe6e9;font:12px Arial;cursor:pointer;');
            x.addEventListener('click', function () {
                if (box.parentNode) box.parentNode.removeChild(box);
            });
            row.appendChild(x);
            box.appendChild(row);
            document.body.appendChild(box);
        } catch (e) { /* never break the page over a notice */ }
    }

    function boot() {
        fetchBuild(BUILD_URL, function (src) {
            if (src && src.length > 1000 && looksLikeBuild(src)) {
                if (inject(stripHeader(src))) {
                    try { console.log('[omni] loader: build injected'); } catch (e) {}
                    return;
                }
            }
            // Retry once after 5s (slow page or network); then stay quiet.
            tried++;
            if (tried < 2) {
                setTimeout(boot, 5000);
            } else {
                try { console.warn('[omni] loader: build unreachable'); } catch (e) {}
            }
        });
    }

    boot();
    if (document.body) {
        showNotice();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showNotice, { once: true });
    }
})();
