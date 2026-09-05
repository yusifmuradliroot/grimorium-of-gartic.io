// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      1.0
// @description  Omni loader — self-checks version, then fetches the framework and runs it.
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (w.__omniVoyager) return;
    w.__omniVoyager = true;

    const VERSION = '1.0';
    const SELF_URL = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/aetherial/omni/voyager/voyager.user.js';
    const INSTALL_URL = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@aetherial/omni/voyager/voyager.user.js';
    const FRAMEWORK_URL = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@aetherial/omni/omni/omni.js';
    const FRAMEWORK_FALLBACK = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/aetherial/omni/omni/omni.js';
    const FRAMEWORK_MUST_CONTAIN = 'omniFramework';

    function fetchText(url, cb, eb) {
        const full = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: full, timeout: 10000,
                    onload: r => (r.status >= 200 && r.status < 400 && r.responseText) ? cb(r.responseText) : eb && eb('status ' + r.status),
                    onerror: () => eb && eb('onerror'), ontimeout: () => eb && eb('timeout') });
            } else if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                GM.xmlHttpRequest({ method: 'GET', url: full,
                    onload: r => (r.status >= 200 && r.status < 400 && r.responseText) ? cb(r.responseText) : eb && eb('status'),
                    onerror: () => eb && eb('onerror') });
            } else {
                fetch(full, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('fetch ' + r.status); return r.text(); }).then(cb).catch(e => eb && eb(String(e)));
            }
        } catch (e) { eb && eb(String(e)); }
    }

    function parseVersion(src) {
        const m = src.match(/@version\s+(\S+)/);
        return m ? m[1] : null;
    }

    function showBlocker(remoteVer) {
        function render() {
            if (!document.body) { setTimeout(render, 200); return; }
            const overlay = document.createElement('div');
            overlay.id = 'omni-voyager-block';
            overlay.style.cssText = 'position:fixed !important;inset:0 !important;z-index:2147483647 !important;background:#808080 !important;display:flex !important;align-items:center !important;justify-content:center !important;font-family:Arial,sans-serif !important;';
            const card = document.createElement('div');
            card.style.cssText = 'width:420px !important;max-width:92vw !important;background:#1e272e !important;border:2px solid #c0392b !important;border-radius:12px !important;box-shadow:0 8px 32px rgba(0,0,0,.5) !important;color:#ecf0f1 !important;overflow:hidden !important;';
            const head = document.createElement('div');
            head.style.cssText = 'padding:12px 16px !important;background:#c0392b !important;font:700 14px Arial !important;';
            head.textContent = 'Omni loader outdated';
            const body = document.createElement('div');
            body.style.cssText = 'padding:20px !important;display:flex !important;flex-direction:column !important;gap:14px !important;font:13px/1.5 Arial !important;';
            const msg = document.createElement('div');
            msg.textContent = 'omni/voyager is outdated (yours: v' + VERSION + ', latest: v' + remoteVer + '). Please update manually.';
            const btn = document.createElement('a');
            btn.href = INSTALL_URL;
            btn.textContent = 'Update voyager.user.js';
            btn.style.cssText = 'display:block !important;text-align:center !important;padding:12px !important;background:#27ae60 !important;color:#fff !important;border-radius:8px !important;font:bold 13px Arial !important;text-decoration:none !important;';
            body.appendChild(msg);
            body.appendChild(btn);
            card.appendChild(head);
            card.appendChild(body);
            overlay.appendChild(card);
            document.body.appendChild(overlay);
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
        else render();
    }

    function execFramework(code, src) {
        if (code.indexOf(FRAMEWORK_MUST_CONTAIN) === -1) {
            console.error('[omni] framework verify fail: ' + src);
            return false;
        }
        try {
            Function('window', 'document', 'unsafeWindow', code + '\n//# sourceURL=' + src)(w, document, w);
            console.log('[omni] framework running (' + src + ')');
            return true;
        } catch (e) {
            console.error('[omni] framework exec fail', e);
            return false;
        }
    }

    function loadFramework() {
        fetchText(FRAMEWORK_URL,
            code => { if (!execFramework(code, FRAMEWORK_URL)) loadFallback(); },
            () => loadFallback());
    }

    function loadFallback() {
        fetchText(FRAMEWORK_FALLBACK,
            code => { execFramework(code, FRAMEWORK_FALLBACK); },
            err => { console.error('[omni] framework unreachable', err); });
    }

    console.log('[omni] loader v' + VERSION + ' — self-check first');
    fetchText(SELF_URL,
        code => {
            const remoteVer = parseVersion(code);
            if (remoteVer && remoteVer !== VERSION) {
                console.error('[omni] outdated: local v' + VERSION + ' vs remote v' + remoteVer);
                showBlocker(remoteVer);
                return;
            }
            loadFramework();
        },
        () => { loadFramework(); });
})();
