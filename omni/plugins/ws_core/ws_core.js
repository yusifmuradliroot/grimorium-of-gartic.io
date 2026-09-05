// ws_core — shared packet bus over Orbit. Plugins use this, never raw WS.
// Provides: onPacket(code, cb), sendDraw(packet), getSid(), onSid(cb), sendRaw(str).
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('ws_core');
    if (!token || token.indexOf('ws_core') === -1) return;
    if (w.__omniWsCore) return;
    w.__omniWsCore = true;

    const subs = {};
    const sidWaits = [];

    function sid() {
        try { return Orbit.api.getMyWsId(); } catch (e) { return null; }
    }
    function fireSid(id) {
        while (sidWaits.length) {
            const cb = sidWaits.shift();
            try { cb(id); } catch (e) {}
        }
    }
    function parseEvent(msg) {
        if (msg == null || typeof msg.indexOf !== 'function') return null;
        const at = msg.indexOf('42[');
        if (at < 0) return null;
        try {
            const data = JSON.parse(msg.slice(at + 1));
            if (Array.isArray(data)) return data;
        } catch (e) {}
        return null;
    }

    try {
        Orbit.hub.onWS(msg => {
            if (msg == null || typeof msg.indexOf !== 'function') return;
            // E5 first, direct extract (tolerant): 42["5",myid,mywsid,...
            const P = '42["5",';
            const at = msg.indexOf(P);
            if (at >= 0) {
                const parts = msg.slice(at + P.length).split(',');
                if (parts.length >= 2) {
                    const id = Number(parts[1]);
                    if (Number.isFinite(id)) {
                        const before = sid();
                        try { Orbit.api.setMyWsId(id); } catch (e) {}
                        if (before == null) fireSid(id);
                    }
                }
            }
            const data = parseEvent(msg);
            if (!data) return;
            const code = String(data[0]);
            const list = subs[code];
            if (list) list.slice().forEach(cb => { try { cb(data, msg); } catch (e) {} });
        });
    } catch (e) {}
    try {
        Orbit.events.on('mywsid-change', () => {
            const id = sid();
            if (id != null) fireSid(id);
        });
    } catch (e) {}

    w.WsCore = {
        version: '1.0',
        onPacket: function (code, cb) {
            if (typeof cb !== 'function') return null;
            const k = String(code);
            if (!subs[k]) subs[k] = [];
            subs[k].push(cb);
            return cb;
        },
        offPacket: function (code, cb) {
            const list = subs[String(code)];
            if (!list) return;
            const i = list.indexOf(cb);
            if (i > -1) list.splice(i, 1);
        },
        getPlayers: function () {
            try { return Orbit.api.getPlayers(); } catch (e) { return []; }
        },
        onRoster: function (cb) {
            if (typeof cb !== 'function') return;
            try { Orbit.events.on('api-roster', cb); } catch (e) {}
        },
        getSid: function () { return sid(); },
        onSid: function (cb) {
            if (typeof cb !== 'function') return;
            const id = sid();
            if (id != null) { try { cb(id); } catch (e) {} return; }
            sidWaits.push(cb);
        },
        sendDraw: function (packet) {
            const s = sid();
            if (s == null) return false;
            try { return Orbit.hub.sendWS('42["10",' + s + ',' + JSON.stringify(packet) + ']'); }
            catch (e) { return false; }
        },
        sendRaw: function (str) {
            try { return Orbit.hub.sendWS(str); } catch (e) { return false; }
        }
    };
    console.log('[ws_core] packet bus ready');
})();
