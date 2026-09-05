// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      1.0
// @description  Omni loader — fetches the framework and runs it.
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

    function load() {
        fetchText(FRAMEWORK_URL,
            code => { if (!execFramework(code, FRAMEWORK_URL)) loadFallback(); },
            () => loadFallback());
    }

    function loadFallback() {
        fetchText(FRAMEWORK_FALLBACK,
            code => { execFramework(code, FRAMEWORK_FALLBACK); },
            err => { console.error('[omni] framework unreachable', err); });
    }

    console.log('[omni] loader v' + VERSION);
    load();
})();
