// ==UserScript==
// @name         Omni wiretap
// @namespace    voyager
// @version      1.0
// @description  Voyager · part of Omni.
// @match        https://gartic.io/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

// Passive socket tap with replay buffer. Runs at document-start, before any
// game socket exists, so nothing is ever missed. Keeps the latest E5 (join
// identity, pinned) plus the last 200 packets. ws_core drains this on boot
// (even mid-room) and then listens live. No parsing, no logs, no UI.
(function () {
    'use strict';
    if (window.__omniWiretap) return;
    const buf = { e5: null, rest: [] };
    window.__omniWiretap = buf;
    const NativeWS = window.WebSocket;
    function feed(dir, msg) {
        if (typeof msg !== 'string') return;
        try {
            if (dir === 'in' && msg.indexOf('42["5",') > -1) { buf.e5 = msg; return; }
            buf.rest.push((dir === 'in' ? '<' : '>') + msg.slice(0, 400));
            if (buf.rest.length > 200) buf.rest.shift();
        } catch (e) {}
    }
    function arm(inst) {
        if (!inst || inst.__tapped) return;
        inst.__tapped = true;
        try {
            const realSend = inst.send.bind(inst);
            inst.send = function (data) { feed('out', data); return realSend(data); };
            inst.addEventListener('message', e => feed('in', e && e.data));
        } catch (e) {}
    }
    function PatchedWS(url, protocols) {
        const inst = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
        arm(inst);
        return inst;
    }
    try {
        PatchedWS.prototype = NativeWS.prototype;
        window.WebSocket = PatchedWS;
        const origAdd = NativeWS.prototype.addEventListener;
        NativeWS.prototype.addEventListener = function (type, cb, opts) {
            if (type === 'message' && typeof cb === 'function' && !this.__tapped) arm(this);
            return origAdd.call(this, type, cb, opts);
        };
    } catch (e) {}
})();
