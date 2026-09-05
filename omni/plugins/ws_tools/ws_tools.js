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
        if (typeof msg !== 'string') return;
        console.log('[ws_tools ' + dir + ']', msg.slice(0, 160));
        if (dir !== 'in') return;
        const at = msg.indexOf('42[');
        if (at < 0) return;
        let data;
        try { data = JSON.parse(msg.slice(at + 1)); } catch (e) { return; }
        if (!Array.isArray(data) || String(data[0]) !== '5') return;
        if (data[2] != null && Number.isFinite(Number(data[2]))) writeSid(Number(data[2]), 'd2');
        else if (data[1] != null && Number.isFinite(Number(data[1]))) writeSid(Number(data[1]), 'd1-fallback');
    }

    try { Orbit.hub.onWS(m => inspect(m, 'in')); } catch (e) {}
    try {
        if (typeof w.onWSSend === 'function') w.onWSSend(m => inspect(m, 'out'));
    } catch (e) {}
    console.log('[ws_tools] logger + catcher active');
})();
