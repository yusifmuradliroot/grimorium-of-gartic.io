// ==UserScript==
// @name         Omni Voyager
// @namespace    omni-voyager
// @version      1.0.0
// @description  Voyager — Omni stable injector. Self-checks version from public file, then injects Orbit (fixed). Manual update if outdated. No Hub/API/GUI — all in Orbit.
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) ? GM_info.script.version : '1.0.0';
    const VOYAGER_URL = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/voyager/voyager.user.js';
    const VOYAGER_FALLBACK = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/voyager/voyager.user.js';
    const ORBIT_URL = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/orbit/orbit.js';
    const ORBIT_FALLBACK = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/orbit/orbit.js';
    const GITHUB_URL = 'https://github.com/yusifmuradliroot/grimorium-of-gartic.io/blob/main/scripts/voyager/voyager.user.js';
    const ORBIT_MUST_CONTAIN = 'orbitCore';

    function fetchText(url, cb, eb) {
        const full = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: full, headers: { 'Cache-Control': 'no-cache' }, timeout: 10000, onload: function (r) { if (r.status >= 200 && r.status < 400 && r.responseText) cb(r.responseText); else eb && eb('status ' + r.status); }, onerror: function () { eb && eb('onerror'); }, ontimeout: function () { eb && eb('timeout'); } });
            } else if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                GM.xmlHttpRequest({ method: 'GET', url: full, onload: function (r) { if (r.status >= 200 && r.status < 400 && r.responseText) cb(r.responseText); else eb && eb('status'); }, onerror: function () { eb && eb('onerror'); } });
            } else {
                fetch(full, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('fetch ' + r.status); return r.text(); }).then(cb).catch(function (e) { eb && eb(String(e)); });
            }
        } catch (e) { eb && eb(String(e)); }
    }

    function parseVersion(text) {
        var m = text.match(/\/\/\s*@version\s+([^\s]+)/m);
        return m ? m[1].trim() : null;
    }

    function showUpdateUI(remoteVer) {
        function ensureBody(cb) {
            if (document.body) cb();
            else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb, { once: true });
            else setTimeout(function () { ensureBody(cb); }, 100);
        }
        ensureBody(function () {
            if (document.getElementById('voyager-update-styles')) return;
            var s = document.createElement('style');
            s.id = 'voyager-update-styles';
            s.textContent = '#voyager-update{position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(0,0,0,.88)!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:Arial,sans-serif!important;backdrop-filter:blur(4px)!important}#voyager-card{width:420px!important;max-width:90vw!important;background:#0f1419!important;border:1px solid #2c3e50!important;border-radius:16px!important;padding:24px!important;text-align:center!important;box-shadow:0 20px 60px rgba(0,0,0,.6)!important}#voyager-card h1{color:#fff!important;font:700 18px Arial!important;margin:0 0 8px!important}#voyager-card p{color:#b2bec3!important;font:13px/1.5 Arial!important;margin:0 0 16px!important}#voyager-card .vver{color:#636e72!important;font:11px monospace!important;margin-bottom:16px!important}#voyager-btn{display:inline-block!important;padding:12px 24px!important;background:#3498db!important;color:#fff!important;border:none!important;border-radius:8px!important;font:700 13px Arial!important;cursor:pointer!important;text-decoration:none!important}#voyager-btn:hover{background:#2980b9!important}';
            (document.head || document.documentElement).appendChild(s);
            var overlay = document.createElement('div');
            overlay.id = 'voyager-update';
            overlay.innerHTML = '<div id="voyager-card"><h1>Omni:Voyager güncel değil</h1><p>Yüklü: v' + VERSION + ' → Güncel: v' + (remoteVer || '?') + '<br>Lütfen manuel olarak güncelleyin.</p><div class="vver">Voyager bir kez yayınlanır, manuel güncelleme gerekir</div><a id="voyager-btn" href="' + GITHUB_URL + '" target="_blank" rel="noopener">GitHub\'da Güncelle →</a></div>';
            document.body.appendChild(overlay);
            var btn = overlay.querySelector('#voyager-btn');
            if (btn) btn.addEventListener('click', function () { try { window.open(GITHUB_URL, '_blank'); } catch (e) { location.href = GITHUB_URL; } });
            console.warn('[voyager] outdated: local ' + VERSION + ' remote ' + remoteVer + ' → update required');
        });
    }

    function execOrbit(code, src) {
        try {
            var fn = Function('window', 'document', 'unsafeWindow', code + '\n//# sourceURL=' + src);
            var w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            fn(w, document, w);
            console.log('[voyager] orbit injected ' + src);
        } catch (e) {
            console.error('[voyager] orbit exec fail', e);
            try { Function(code + '\n//# sourceURL=' + src)(); console.log('[voyager] orbit fallback exec'); } catch (e2) { console.error('[voyager] orbit fallback fail', e2); }
        }
    }

    function loadOrbit() {
        fetchText(ORBIT_URL, function (code) {
            if (code.indexOf(ORBIT_MUST_CONTAIN) === -1) {
                console.warn('[voyager] orbit mustContain fail primary, trying fallback');
                fetchText(ORBIT_FALLBACK, function (code2) {
                    if (code2.indexOf(ORBIT_MUST_CONTAIN) === -1) { console.error('[voyager] orbit mustContain fail fallback'); return; }
                    execOrbit(code2, ORBIT_FALLBACK);
                }, function () { console.error('[voyager] orbit fetch fallback fail'); });
                return;
            }
            execOrbit(code, ORBIT_URL);
        }, function () {
            console.warn('[voyager] orbit primary fail, trying fallback');
            fetchText(ORBIT_FALLBACK, function (code) {
                if (code.indexOf(ORBIT_MUST_CONTAIN) === -1) { console.error('[voyager] orbit mustContain fail fallback'); return; }
                execOrbit(code, ORBIT_FALLBACK);
            }, function () { console.error('[voyager] orbit fetch fail'); });
        });
    }

    // Step 1: self-check via public @version
    fetchText(VOYAGER_URL, function (text) {
        var remoteVer = parseVersion(text);
        if (!remoteVer) { console.warn('[voyager] parse version fail, loading orbit anyway'); loadOrbit(); return; }
        if (remoteVer !== VERSION) { showUpdateUI(remoteVer); return; }
        console.log('[voyager] up to date v' + VERSION + ' → loading orbit');
        loadOrbit();
    }, function () {
        fetchText(VOYAGER_FALLBACK, function (text) {
            var remoteVer = parseVersion(text);
            if (!remoteVer) { console.warn('[voyager] parse version fail fallback, loading orbit'); loadOrbit(); return; }
            if (remoteVer !== VERSION) { showUpdateUI(remoteVer); return; }
            console.log('[voyager] up to date (fallback) v' + VERSION + ' → loading orbit');
            loadOrbit();
        }, function () {
            console.warn('[voyager] version check fail both, loading orbit anyway');
            loadOrbit();
        });
    });
})();
