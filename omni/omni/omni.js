// omniFramework — Omni core: Hub + API + Loader + Menu (single Omni branding)

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (w.__omni) return;
    w.__omni = true;

    const VERSION = '1.0';
    const PLUGIN_BASE = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/aetherial/omni/plugins/';
    const STORE_AGREED = 'omni_agreed';
    const STORE_PLUGINS = 'omni_plugins_selected';

    function gGet(k, d) {
        try { if (typeof GM_getValue === 'function') { const v = GM_getValue(k, d); if (v !== undefined && !(v && typeof v.then === 'function')) return v; } } catch (e) {}
        try { const v = localStorage.getItem(k); if (v !== null) { try { return JSON.parse(v); } catch (e) { return v; } } } catch (e) {}
        return d;
    }
    function gSet(k, v) {
        try { if (typeof GM_setValue === 'function') GM_setValue(k, v); } catch (e) {}
        try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch (e) {}
    }
    function fetchText(url, cb, eb) {
        const full = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: full, timeout: 15000,
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

    // ============ 1) WS HUB ============
    const NativeWS = w.WebSocket;
    let activeWS = null;
    const listeners = [];
    w.__omniWsHub = true;

    function patchInstance(inst) {
        if (inst.__omniPatched) return;
        inst.__omniPatched = true;
        activeWS = inst;
        const realSend = inst.send.bind(inst);
        inst.send = function (data) { return realSend(data); };
        inst.addEventListener('open', () => { activeWS = inst; });
        inst.addEventListener('close', () => { if (activeWS === inst) activeWS = null; });
        inst.addEventListener('message', e => {
            const msg = e.data;
            for (let i = 0; i < listeners.length; i++) try { listeners[i](msg); } catch (err) {}
        });
    }
    function PatchedWS(url, protocols) {
        const inst = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
        patchInstance(inst);
        return inst;
    }
    PatchedWS.prototype = NativeWS.prototype;
    try {
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(k => { PatchedWS[k] = NativeWS[k]; });
        Object.defineProperty(PatchedWS, Symbol.hasInstance, { value: i => i instanceof NativeWS });
    } catch (e) {}
    w.WebSocket = PatchedWS;

    const origAddEvent = NativeWS.prototype.addEventListener;
    NativeWS.prototype.addEventListener = function (type, cb, opts) {
        if (type === 'message' && typeof cb === 'function' && !this.__omniPatched) {
            activeWS = this;
            patchInstance(this);
        }
        return origAddEvent.call(this, type, cb, opts);
    };
    try {
        const desc = Object.getOwnPropertyDescriptor(NativeWS.prototype, 'onmessage');
        if (desc && desc.set) {
            Object.defineProperty(NativeWS.prototype, 'onmessage', {
                get: function () { return desc.get.call(this); },
                set: function (cb) {
                    if (typeof cb === 'function' && !this.__omniPatched) {
                        activeWS = this;
                        patchInstance(this);
                    }
                    desc.set.call(this, cb);
                },
                configurable: true
            });
        }
    } catch (e) {}

    w.sendWS = function (data) {
        if (!activeWS || activeWS.readyState !== 1) return false;
        activeWS.send(data);
        return true;
    };
    w.onWS = function (cb) { if (typeof cb !== 'function') return null; listeners.push(cb); return cb; };
    w.offWS = function (cb) { const i = listeners.indexOf(cb); if (i > -1) listeners.splice(i, 1); };
    w.wsHubGetSocket = function () { return activeWS; };

    // ============ 2) API: session + identity (kernel owns mywsid) ============
    let mywsid = null;
    let myid = null;
    let sessionOpen = false;
    w.__omniApiReady = true;

    function setMyWsId(id) {
        if (id === mywsid) return;
        mywsid = id;
        w.mywsid = id;
        try { w.dispatchEvent(new CustomEvent('mywsid-change', { detail: id })); } catch (e) {}
    }
    function setSession(open) {
        if (open === sessionOpen) return;
        sessionOpen = open;
        // Identity NEVER cleared here: mywsid survives reconnects, next E5 overwrites it.
        try { w.dispatchEvent(new CustomEvent(open ? 'ws-session-open' : 'ws-session-close')); } catch (e) {}
    }
    function applyRoomInfo(data) {
        setSession(true);
        if (data[2] != null && Number.isFinite(Number(data[2]))) setMyWsId(Number(data[2]));
        else if (data[1] != null && Number.isFinite(Number(data[1]))) setMyWsId(Number(data[1]));
        if (data[1] != null) { myid = data[1]; w.myid = data[1]; }
    }
    function handleMessage(msg) {
        if (typeof msg !== 'string') return;
        if (msg === '40' || msg.indexOf('40{') === 0) { setSession(true); return; }
        if (msg === '41') { setSession(false); return; }
        const at = msg.indexOf('42[');
        if (at < 0) return;
        let data;
        try { data = JSON.parse(msg.slice(at + 1)); } catch (e) { return; }
        if (!Array.isArray(data)) return;
        if (String(data[0]) === '5') applyRoomInfo(data);
    }
    w.onWS(handleMessage);
    w.getMyWsId = function () { return mywsid; };
    w.getMyId = function () { return myid; };
    w.getSession = function () { return sessionOpen || mywsid != null; };

    // ============ 3) w.Orbit: the only API plugins may use ============
    const ORBIT_SECRET = 'orbit_v1_9f3a7c2e1d5b8a4f';
    w.Orbit = {
        version: VERSION,
        verify: function (id) {
            if (!id) return null;
            return 'ok:' + id + ':' + ORBIT_SECRET.slice(0, 8);
        },
        hub: {
            sendWS: function (d) { return w.sendWS(d); },
            onWS: function (cb) { return w.onWS(cb); },
            offWS: function (cb) { return w.offWS(cb); },
            getSocket: function () { return w.wsHubGetSocket(); }
        },
        api: {
            getMyWsId: function () { return w.getMyWsId(); },
            getMyId: function () { return w.getMyId(); },
            getSession: function () { return w.getSession(); }
        },
        store: {
            get: function (k, d) { try { return gGet(k, d); } catch (e) { return d; } },
            set: function (k, v) { try { gSet(k, v); } catch (e) {} }
        },
        events: {
            on: function (ev, cb) { w.addEventListener(ev, cb); },
            off: function (ev, cb) { w.removeEventListener(ev, cb); }
        }
    };

    // ============ 4) LOADER (.js now, .fs later) ============
    const vmInstances = {};
    function createVM() {
        const realWindow = w;
        const vmWindow = Object.create(realWindow);
        const tracked = new Set();
        const handler = {
            get(target, prop) {
                if (prop in target) return target[prop];
                return realWindow[prop];
            },
            set(target, prop, value) {
                tracked.add(prop);
                target[prop] = value;
                try { realWindow[prop] = value; } catch (e) {}
                return true;
            },
            has(target, prop) { return prop in target || prop in realWindow; }
        };
        return { proxy: new Proxy(vmWindow, handler), tracked: tracked };
    }
    function executePlugin(code, src, plugin) {
        if (plugin.mustContain && code.indexOf(plugin.mustContain) === -1) return false;
        const vm = createVM();
        vmInstances[plugin.id] = vm;
        try {
            const uw = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : w);
            Function('window', 'document', 'unsafeWindow', code + '\n//# sourceURL=' + src)(vm.proxy, document, uw);
            return true;
        } catch (e) {
            delete vmInstances[plugin.id];
            return false;
        }
    }
    function unloadPlugin(id) {
        const vm = vmInstances[id];
        if (vm) {
            vm.tracked.forEach(p => { try { delete w[p]; } catch (e) {} });
            delete vmInstances[id];
        }
        try {
            const stop = w['OmniStop_' + id];
            if (typeof stop === 'function') stop();
        } catch (e) {}
    }
    function loadPlugin(id, file, mustContain, cb) {
        const url = PLUGIN_BASE + file;
        fetchText(url,
            code => { cb && cb(executePlugin(code, url, { id: id, mustContain: mustContain })); },
            () => { cb && cb(false); });
    }

    // ============ 5) MENU: agreement + plugin selection ============
    function ensureBody(fn) {
        if (document.body) fn();
        else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else setTimeout(() => ensureBody(fn), 200);
    }
    function showMenu() {
        ensureBody(() => {
            const overlay = document.createElement('div');
            overlay.id = 'omni-overlay';
            overlay.style.cssText = 'position:fixed !important;inset:0 !important;z-index:2147483647 !important;background:rgba(0,0,0,.72) !important;display:flex !important;align-items:center !important;justify-content:center !important;font-family:Arial,sans-serif !important;';
            overlay.innerHTML =
                '<div id="omni-card" style="width:440px !important;max-width:92vw !important;background:#fff !important;border-radius:16px !important;overflow:hidden !important;box-shadow:0 20px 60px rgba(0,0,0,.4) !important;">' +
                '<div style="padding:16px 20px !important;background:#0f1419 !important;color:#fff !important;font:700 15px Arial !important;">Omni</div>' +
                '<div style="padding:20px !important;display:flex !important;flex-direction:column !important;gap:14px !important;">' +
                '<label style="font:13px Arial !important;color:#2c3e50 !important;display:flex !important;gap:8px !important;align-items:flex-start !important;"><input type="checkbox" id="omni-agree" style="margin-top:2px !important;"> Personal use only. I will not disturb other users, share derived works publicly, and I accept the ban risk.</label>' +
                '<div id="omni-plugin-list" style="display:flex !important;flex-direction:column !important;gap:8px !important;font:13px Arial !important;color:#2c3e50 !important;">Loading plugins…</div>' +
                '<div style="display:flex !important;gap:8px !important;justify-content:flex-end !important;"><button id="omni-skip" style="padding:10px 16px !important;border:1px solid #b2bec3 !important;background:#fff !important;border-radius:8px !important;font:bold 13px Arial !important;cursor:pointer !important;">Skip</button><button id="omni-install" style="padding:10px 16px !important;border:none !important;background:#0f1419 !important;color:#fff !important;border-radius:8px !important;font:bold 13px Arial !important;cursor:pointer !important;">Install &amp; Run</button></div>' +
                '</div></div>';
            document.body.appendChild(overlay);
            const list = overlay.querySelector('#omni-plugin-list');
            fetchText(PLUGIN_BASE + 'index.json',
                raw => {
                    let names = [];
                    try { names = JSON.parse(raw); } catch (e) {}
                    if (!Array.isArray(names) || !names.length) { list.textContent = 'No plugins available.'; return; }
                    list.innerHTML = '';
                    let pending = names.length;
                    names.forEach(n => {
                        fetchText(PLUGIN_BASE + n + '/plugin.json',
                            meta => {
                                let info = null;
                                try { info = JSON.parse(meta); } catch (e) {}
                                const row = document.createElement('label');
                                row.style.cssText = 'display:flex !important;gap:8px !important;align-items:flex-start !important;cursor:pointer !important;';
                                const cb = document.createElement('input');
                                cb.type = 'checkbox';
                                cb.value = (info && info.id) || n;
                                const tx = document.createElement('span');
                                tx.textContent = ((info && info.name) || n) + ' — ' + ((info && info.description) || '');
                                row.appendChild(cb);
                                row.appendChild(tx);
                                row.dataset.file = (info && info.entry) ? n + '/' + info.entry : n + '.js';
                                row.dataset.must = (info && info.mustContain) || n;
                                list.appendChild(row);
                                if (--pending === 0) wire(list, overlay);
                            },
                            () => { if (--pending === 0) wire(list, overlay); });
                    });
                },
                () => { list.textContent = 'Plugin list unreachable.'; wire(list, overlay); });
        });
    }
    function wire(list, overlay) {
        overlay.querySelector('#omni-skip').addEventListener('click', () => overlay.remove());
        overlay.querySelector('#omni-install').addEventListener('click', () => {
            if (!overlay.querySelector('#omni-agree').checked) return;
            gSet(STORE_AGREED, true);
            const sel = [];
            list.querySelectorAll('input:checked').forEach(cb => {
                const row = cb.closest('label');
                sel.push({ id: cb.value, file: row.dataset.file, must: row.dataset.must });
            });
            gSet(STORE_PLUGINS, sel);
            overlay.remove();
            sel.forEach(p => loadPlugin(p.id, p.file, p.must, ok => console.log('[omni] plugin ' + p.id + ': ' + (ok ? 'loaded' : 'FAILED'))));
        });
    }
    function boot() {
        showBadge();
        const agreed = gGet(STORE_AGREED, false);
        if (agreed && typeof agreed.then === 'function') { agreed.then(a => { a ? loadSelected() : showMenu(); }); return; }
        if (agreed) loadSelected();
        else showMenu();
    }
    function loadSelected() {
        const raw = gGet(STORE_PLUGINS, []);
        const go = sel => {
            const arr = Array.isArray(sel) ? sel : [];
            arr.forEach(p => {
                if (typeof p === 'string') return;
                loadPlugin(p.id, p.file, p.must, ok => console.log('[omni] plugin ' + p.id + ': ' + (ok ? 'loaded' : 'FAILED')));
            });
        };
        if (raw && typeof raw.then === 'function') raw.then(go);
        else go(raw);
    }

    // ============ 6) Debug badge (mobile has no console) ============
    function showBadge() {
        ensureBody(() => {
            if (document.getElementById('omni-debug-badge')) return;
            const badge = document.createElement('div');
            badge.id = 'omni-debug-badge';
            badge.style.cssText = 'position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:2147483646;padding:4px 10px;border-radius:12px;font:bold 10px monospace;color:#fff;pointer-events:none;';
            document.body.appendChild(badge);
            setInterval(() => {
                const sock = w.wsHubGetSocket();
                const open = sock && sock.readyState === 1;
                const sid = w.getMyWsId();
                if (open && sid != null) { badge.style.background = '#27ae60'; badge.textContent = 'WS:OPEN sid:' + sid; }
                else if (open) { badge.style.background = '#e67e22'; badge.textContent = 'WS:OPEN sid:NULL'; }
                else { badge.style.background = '#c0392b'; badge.textContent = 'WS:CLOSED'; }
            }, 1000);
        });
    }

    console.log('%c[omni] core v' + VERSION + ' ready', 'color:#8e44ad;font-weight:bold');
    boot();
})();
