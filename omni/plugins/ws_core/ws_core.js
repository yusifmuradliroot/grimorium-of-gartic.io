var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};



(function () {
    'use strict';
    const p = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (p.Orbit && typeof p.Orbit.verify === 'function') ? p.Orbit : null;
    if (!Orbit) return;
    const o = Orbit.verify('ws_core');
    if (!o || o.indexOf('ws_core') === -1) return;
    if (p.__omniWsCore) return;
    p.__omniWsCore = true;

    const n = {};
    const m = [];

    function l() {
        try { return Orbit.api.getMyWsId(); } catch (e) { return null; }
    }
    function c(id) {
        while (m.length) {
            const cb = m.shift();
            try { cb(id); } catch (e) {}
        }
    }
    function g(msg) {
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
            
            const a = '42["5",';
            const at = msg.indexOf(a);
            if (at >= 0) {
                const h = msg.slice(at + a.length).split(',');
                if (h.length >= 2) {
                    const id = Number(h[1]);
                    if (Number.isFinite(id)) {
                        const b = l();
                        try { Orbit.api.setMyWsId(id); } catch (e) {}
                        if (b == null) c(id);
                    }
                }
            }
            const data = g(msg);
            if (!data) return;
            const code = String(data[0]);
            const list = n[code];
            if (list) list.slice().forEach(cb => { try { cb(data, msg); } catch (e) {} });
        });
    } catch (e) {}
    try {
        Orbit.events.on(__f("37232d29333e7739323b343d3f"), () => {
            const id = l();
            if (id != null) c(id);
        });
    } catch (e) {}

    p.WsCore = {
        version: '1.0',
        onPacket: function (code, cb) {
            if (typeof cb !== 'function') return null;
            const f = String(code);
            if (!n[f]) n[f] = [];
            n[f].push(cb);
            return cb;
        },
        offPacket: function (code, cb) {
            const list = n[String(code)];
            if (!list) return;
            const d = list.indexOf(cb);
            if (d > -1) list.splice(d, 1);
        },
        getPlayers: function () {
            try { return Orbit.api.getPlayers(); } catch (e) { return []; }
        },
        onRoster: function (cb) {
            if (typeof cb !== 'function') return;
            try { Orbit.events.on('api-roster', cb); } catch (e) {}
        },
        getSid: function () { return l(); },
        onSid: function (cb) {
            if (typeof cb !== 'function') return;
            const id = l();
            if (id != null) { try { cb(id); } catch (e) {} return; }
            m.push(cb);
        },
        sendDraw: function (packet) {
            const j = l();
            if (j == null) return false;
            try { return Orbit.hub.sendWS('42["10",' + j + ',' + JSON.stringify(packet) + ']'); }
            catch (e) { return false; }
        },
        sendRaw: function (str) {
            try { return Orbit.hub.sendWS(str); } catch (e) { return false; }
        }
    };
    console.log(__f("012d29053935283f077a2a3b39313f2e7a382f297a283f3b3e23"));
})();
