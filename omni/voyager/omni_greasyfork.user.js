// ==UserScript==
// @name         Omni (GreasyFork loader)
// @namespace    omni-loader
// @version      1.1
// @description  Loads Omni for Gartic.io. This file is only a loader: it fetches the current build and injects it into the page. No game code lives here.
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

    if (document.readyState === 'loading' && !document.documentElement) {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
