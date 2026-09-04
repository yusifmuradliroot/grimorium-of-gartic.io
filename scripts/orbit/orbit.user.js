// orbitCore — Omni Orbit (Voyager 2nd stage). Public'te minimal test, private'da full Hub+API+GUI+Loader olacak.
// Şimdilik minimal: Voyager'dan sonra çalışır, test-payload inject eder, Orbit GUI'siz.
// Full Orbit (Hub+API+GUI+Loader) security konuşulunca privateecosystem/orbit/ altında geliştirilecek, public'e obfuscated gidecek.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (w.__orbitCore) return;
    w.__orbitCore = true;
    // orbitCore marker — Voyager mustContain checks this string

    console.log('%c[orbit] orbitCore v0.1 minimal — Voyager inject OK', 'color:#8e44ad;font-weight:bold');

    // Minimal test: fetch test-payload and inject (proves Orbit can load dependencies)
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

    const TEST_URL = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/gartic-test-payload.js';
    const TEST_FALLBACK = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/gartic-test-payload.js';

    function loadTestPayload() {
        fetchText(TEST_URL, function (code) {
            if (code.indexOf('garticTestPayloadLoaded') === -1) {
                fetchText(TEST_FALLBACK, function (code2) { exec(code2); }, function () {});
                return;
            }
            exec(code);
        }, function () {
            fetchText(TEST_FALLBACK, function (code) { exec(code); }, function () {});
        });
    }

    function exec(code) {
        try {
            var fn = Function('window', 'document', 'unsafeWindow', code + '\n//# sourceURL=orbit:test-payload');
            var uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            // test-payload uses window directly, give it real window
            fn(uw, document, uw);
            console.log('[orbit] test-payload injected');
        } catch (e) { console.error('[orbit] test-payload exec fail', e); }
    }

    // Defer until body exists (test-payload creates badge)
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadTestPayload);
    else setTimeout(loadTestPayload, 400);

    // Orbit ready marker for Voyager health check
    w.__orbitReady = true;
})();
