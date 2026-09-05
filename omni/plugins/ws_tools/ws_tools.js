// ws_tools — WS traffic logger + independent E5 mywsid catcher.
// Writes ONLY to the kernel slot (Orbit.api.setMyWsId). Never keeps its own mywsid.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('ws_tools');
    if (!token || token.indexOf('ws_tools') === -1) return;
    if (w.__omniWsTools) return;
    w.__omniWsTools = true;

    function writeSid(id, where) {
        let ok = false;
        try { ok = !!Orbit.api.setMyWsId(id); } catch (e) {}
        if (!ok) { try { ok = !!w.setMyWsId(id); } catch (e) {} }
        console.log('[ws_tools] E5 mywsid=' + id + ' (' + where + ') kernel-write:' + (ok ? 'OK' : 'FAIL') + ' kernel-now:' + Orbit.api.getMyWsId());
    }

    function inspect(msg, dir) {
        if (msg == null || typeof msg.indexOf !== 'function' || typeof msg.slice !== 'function') return;
        console.log('[ws_tools ' + dir + ']', msg.slice(0, 160));
        if (dir !== 'in') return;
        // Direct extract, no JSON: 42["5",myid,mywsid,... → 2nd token after prefix.
        const P = '42["5",';
        const at = msg.indexOf(P);
        if (at < 0) return;
        const parts = msg.slice(at + P.length).split(',');
        if (parts.length < 2) return;
        const sid = Number(parts[1]);
        if (Number.isFinite(sid)) writeSid(sid, 'direct');
    }

    let pill = null;
    function ensureUI() {
        if (pill) return;
        if (!document.body) { setTimeout(() => ensureUI(), 300); return; }
        if (document.getElementById('ws-tools-sid')) return;
        pill = document.createElement('div');
        pill.id = 'ws-tools-sid';
        pill.style.cssText = 'position:fixed !important;left:10px !important;bottom:10px !important;z-index:2147483646 !important;display:block !important;padding:5px 10px !important;border-radius:10px !important;font:bold 11px monospace !important;color:#fff !important;background:#7f8c8d !important;pointer-events:none !important;';
        document.body.appendChild(pill);
        paint();
    }
    function paint() {
        if (!pill) return;
        let sid = null;
        try { sid = Orbit.api.getMyWsId(); } catch (e) {}
        if (sid != null) {
            pill.style.background = '#27ae60';
            pill.textContent = 'mywsid:' + sid;
        } else {
            pill.style.background = '#7f8c8d';
            pill.textContent = 'mywsid:…';
        }
    }

    try { Orbit.hub.onWS(m => inspect(m, 'in')); } catch (e) {}
    try {
        if (typeof w.onWSSend === 'function') w.onWSSend(m => inspect(m, 'out'));
    } catch (e) {}
    try { Orbit.events.on('mywsid-change', () => paint()); } catch (e) {}
    setInterval(() => paint(), 2000);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => ensureUI());
    else ensureUI();
    console.log('[ws_tools] v1.4 logger + catcher active');
})();
