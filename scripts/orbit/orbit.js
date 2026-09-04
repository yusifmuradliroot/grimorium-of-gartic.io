// orbitCore — Voyager mustContain marker
(function () {
    'use strict';

    // Use page window for game (WS, API), not sandbox window
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const win = w; // alias for clarity — always page window
    const sandboxWin = window; // for DOM / GM

    const STORE_WELCOME = 'omni_welcome_done';
    const STORE_AGREED = 'omni_agreed';
    const STORE_ALERTS_VER = 'omni_alerts_ver';
    const STORE_THEME = 'omni_theme';
    const STORE_PLUGINS = 'omni_plugins_selected';

    const PLUGINS = [
        {
            id: 'test-payload',
            name: 'Test Payload',
            description: 'Reference — shows green "working" if loader works',
            url: 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/gartic-test-payload.js',
            fallback: 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/gartic-test-payload.js',
            mustContain: 'garticTestPayloadLoaded',
            version: '1.0'
        },
        {
            id: 'pixel',
            name: 'Pixel Bot',
            description: 'Pixel drawing — Omni-native, 770x450',
            url: 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/pixel.user.js',
            fallback: 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/pixel.user.js',
            mustContain: '__omniWsHub',
            version: '2.1-omni'
        },
        {
            id: 'text',
            name: 'Text Bot',
            description: 'Text drawing — vector skeleton, pen [2], 770x450',
            url: 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/scripts/gartic-text-bot.user.js',
            fallback: 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/scripts/gartic-text-bot.user.js',
            mustContain: 'TextEngine',
            version: '2.0-omni'
        }
    ];

    // --- GM storage helpers (sandbox) ---
    const gGet = (k, d) => {
        try { if (typeof GM_getValue === 'function') { const v = GM_getValue(k, d); if (v !== undefined && !(v && typeof v.then === 'function')) return v; } } catch (e) {}
        try { const v = sandboxWin.localStorage.getItem(k); if (v !== null) { try { return JSON.parse(v); } catch (e) { return v; } } } catch (e) {}
        return d;
    };
    const gSet = (k, v) => {
        try { if (typeof GM_setValue === 'function') { GM_setValue(k, v); return; } } catch (e) {}
        try { sandboxWin.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch (e) {}
    };

    // ============================================================
    // 1) WS HUB — verbatim from gartic-ws-hub v1, but guard __omniWsHub
    // ============================================================
    // orbitCore — Voyager mustContain marker
(function () {
        if (w.__omniWsHub || w.__garticWsHub) {
            // Already have a hub (e.g., standalone pixel was loaded before omni) — expose alias and reuse
            if (w.__garticWsHub && !w.__omniWsHub) w.__omniWsHub = true;
            // Ensure omni aliases exist even if hub was from garticWsHub
            if (typeof w.sendWS !== 'function' && typeof w.onWS === 'function') {
                console.log('%c[hub] existing garticWsHub detected — omni reusing', 'color:#0af;font-weight:bold');
            }
            return;
        }
        w.__omniWsHub = true;
        w.__omniHubReady = true;
        const NativeWS = w.WebSocket;
        let activeWS = null;
        const listeners = [];
        const sendListeners = [];
        if (w.wsHubVerbose === undefined) w.wsHubVerbose = false;
        function PatchedWS(url, protocols) {
            const inst = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
            activeWS = inst;
            if (w.wsHubVerbose) console.log('%c[hub] WS NEW ' + url, 'color:#0af;font-weight:bold');
            const realSend = inst.send.bind(inst);
            inst.send = function (data) {
                if (w.wsHubVerbose) console.log('%c[WS \u2192]', 'color:#e74c3c;font-weight:bold', data);
                for (let i = 0; i < sendListeners.length; i++) try { sendListeners[i](data); } catch (e) {}
                return realSend(data);
            };
            inst.addEventListener('open', () => { if (w.wsHubVerbose) console.log('%c[WS OPEN]', 'color:#27ae60;font-weight:bold'); });
            inst.addEventListener('close', () => {
                if (w.wsHubVerbose) console.log('%c[WS CLOSE]', 'color:#c0392b');
                if (activeWS === inst) activeWS = null;
            });
            inst.addEventListener('error', e => { if (w.wsHubVerbose) console.log('%c[WS ERROR]', 'color:#c0392b', e); });
            inst.addEventListener('message', e => {
                const msg = e.data;
                if (w.wsHubVerbose) console.log('%c[WS \u2190]', 'color:#2ecc71;font-weight:bold', msg);
                for (let i = 0; i < listeners.length; i++) try { listeners[i](msg); } catch (err) { console.warn('[hub] listener error', err); }
            });
            return inst;
        }
        PatchedWS.prototype = NativeWS.prototype;
        PatchedWS.CONNECTING = NativeWS.CONNECTING;
        PatchedWS.OPEN = NativeWS.OPEN;
        PatchedWS.CLOSING = NativeWS.CLOSING;
        PatchedWS.CLOSED = NativeWS.CLOSED;
        try { Object.defineProperty(PatchedWS, Symbol.hasInstance, { value: i => i instanceof NativeWS }); } catch (e) {}
        w.WebSocket = PatchedWS;
        w.sendWS = function (data) {
            if (!activeWS || activeWS.readyState !== 1) { console.warn('[hub] sendWS: WS not open'); return false; }
            activeWS.send(data); return true;
        };
        w.onWS = function (cb) { if (typeof cb !== 'function') return null; listeners.push(cb); return cb; };
        w.offWS = function (cb) { const i = listeners.indexOf(cb); if (i > -1) listeners.splice(i, 1); };
        w.onWSSend = function (cb) { if (typeof cb !== 'function') return null; sendListeners.push(cb); return cb; };
        w.offWSSend = function (cb) { const i = sendListeners.indexOf(cb); if (i > -1) sendListeners.splice(i, 1); };
        w.wsHubGetSocket = function () { return activeWS; };
        // Backward compat for plugins that check __garticWsHub
        w.__garticWsHub = true;
        console.log('%c[hub] omni hub v2 ready (unsafeWindow singleton)', 'color:#0af;font-weight:bold');
    })();

    // ============================================================
    // 2) API ENGINE — merged from gartic-api-engine v1.5 + omni fixes
    // ============================================================
    // orbitCore — Voyager mustContain marker
(function () {
        if (w.getMyWsId && w.getMyId && w.getSession && w.__omniApiReady) return;
        w.__omniApiReady = true;
        let mywsid = null;
        let myid = null;
        let sessionOpen = false;
        let drawTurn = null;
        const roster = new Map();
        let lastUnknownWarnTs = 0;
        function warnThrottled(msg, style, data) {
            const now = Date.now();
            if (now - lastUnknownWarnTs < 10000) return;
            lastUnknownWarnTs = now;
            console.warn(msg, style, data);
        }
        function isPlayerObj(o) { return o !== null && typeof o === 'object' && typeof o.nick === 'string' && o.avatar !== undefined; }
        function setMyWsId(id) {
            if (id === mywsid) return;
            const old = mywsid; mywsid = id; w.mywsid = id;
            console.log('%c[api] mywsid: ' + old + ' => ' + id, 'color:#f39c12;font-weight:bold');
            try { w.dispatchEvent(new CustomEvent('mywsid-change', { detail: id })); } catch (e) {}
        }
        function setMyId(id) {
            if (id === myid) return;
            const old = myid; myid = id; w.myid = id;
            console.log('%c[api] myid: ' + old + ' => ' + id, 'color:#e67e22;font-weight:bold');
            try { w.dispatchEvent(new CustomEvent('myid-change', { detail: id })); } catch (e) {}
        }
        function setSession(open) {
            if (open === sessionOpen) return;
            sessionOpen = open;
            if (!open) {
                setMyWsId(null); setMyId(null); roster.clear(); drawTurn = null;
                try { w.dispatchEvent(new CustomEvent('api-roster', { detail: { size: 0 } })); } catch (e) {}
                console.log('%c[api] session closed (41) -> cleared', 'color:#c0392b;font-weight:bold');
            } else {
                console.log('%c[api] session open (40/5)','color:#27ae60;font-weight:bold');
            }
            try { w.dispatchEvent(new CustomEvent(open ? 'ws-session-open' : 'ws-session-close')); } catch (e) {}
            if (!open) emitDrawTurn();
        }
        // Extra: infer session from room packet if 40 was missed (SPA)
        function ensureSession() { if (!sessionOpen) setSession(true); }
        function emitRoster() { try { w.dispatchEvent(new CustomEvent('api-roster', { detail: { size: roster.size } })); } catch (e) {} }
        function emitDrawTurn() {
            try { w.dispatchEvent(new CustomEvent('api-draw-turn', { detail: drawTurn !== null ? drawTurn : { active: false, words: [], since: Date.now(), raw: null } })); } catch (e) {}
        }
        function normalizeDrawTurn(d) {
            const words = []; for (let i = 1; i + 1 < d.length; i += 2) if (typeof d[i] === 'string') words.push({ word: d[i], score: Number.isFinite(d[i + 1]) ? d[i + 1] : null });
            return words.length ? { active: true, words, since: Date.now(), raw: d } : null;
        }
        function handleDrawTurnPacket(data) {
            const info = normalizeDrawTurn(data);
            if (!info) { warnThrottled('%c[api] unknown 16 shape','color:#c0392b', JSON.stringify(data)); return; }
            drawTurn = info;
            console.log('%c[api] draw turn! ' + info.words.map(x => '"' + x.word + '"').join(', '), 'color:#8e44ad;font-weight:bold');
            emitDrawTurn();
        }
        function applyTurnAssign(data) {
            if (data[1] == null) return;
            const mine = myid != null && String(data[1]) === String(myid);
            if (mine) { if (!drawTurn || !drawTurn.active) { drawTurn = { active: true, words: [], since: Date.now(), raw: data }; emitDrawTurn(); } return; }
            if (drawTurn !== null) { drawTurn = null; emitDrawTurn(); console.log('%c[api] turn to other (' + data[1] + ') cleared', 'color:#7f8c8d'); }
        }
        function applyRoomInfo(data) {
            ensureSession();
            if (Number.isFinite(data[2])) setMyWsId(data[2]);
            if (data[1] != null) setMyId(data[1]);
            roster.clear();
            if (Array.isArray(data[5])) data[5].forEach(p => { if (isPlayerObj(p)) roster.set(String(p.id), p); });
            emitRoster();
        }
        function applyJoin(data) { if (!isPlayerObj(data[1])) return; ensureSession(); roster.set(String(data[1].id), data[1]); emitRoster(); }
        function applyLeave(data) { if (data[1]==null) return; roster.delete(String(data[1])); emitRoster(); }
        function normalizeKick(d) {
            const first=d[1], second=d[2];
            if ((typeof first==='number'||typeof first==='string') && second!=null) return { target: second, voters: [first], vote: d[3]===undefined?null:d[3], raw:d };
            return null;
        }
        function handleKickPacket(data) {
            const info=normalizeKick(data);
            if(!info){ warnThrottled('%c[api] unknown kick shape','color:#c0392b', JSON.stringify(data)); return; }
            if(!info.vote){ console.log('%c[api] kick vote not valid','color:#95a5a6', info); return; }
            console.log('%c[api] kick target='+info.target+' voter='+info.voters.join(','),'color:#e67e22;font-weight:bold');
            try{ w.dispatchEvent(new CustomEvent('api-kick',{detail:info})); }catch(e){}
        }
        // Message router — exact copy of original but with ensureSession on 5/23
        function handleMessage(msg) {
            if (typeof msg !== 'string') return;
            if (msg === '40' || msg.startsWith('40{')) return setSession(true);
            if (msg === '41') return setSession(false);
            if (!msg.startsWith('42[')) return;
            let data; try{ data=JSON.parse(msg.slice(2)); }catch(e){return;} if(!Array.isArray(data)) return;
            const code=String(data[0]);
            if (code==='5') applyRoomInfo(data);
            else if (code==='23') applyJoin(data);
            else if (code==='24') applyLeave(data);
            else if (code==='17') { ensureSession(); applyTurnAssign(data); }
            // dispatch to onPkt subscribers
            dispatchPkt(data);
            if (code==='45' || code==='21') handleKickPacket(data);
            if (code==='16') { ensureSession(); handleDrawTurnPacket(data); }
        }
        // onPkt
        const pktSubs=[];
        function dispatchPkt(data){ for(let i=0;i<pktSubs.length;i++) try{ pktSubs[i](data); }catch(e){ console.warn('[api] onPkt error',e); } }
        w.onPkt=function(cb){ if(typeof cb!=='function') return null; pktSubs.push(cb); return cb; };
        w.offPkt=function(cb){ const i=pktSubs.indexOf(cb); if(i>-1) pktSubs.splice(i,1); };
        // Getters — robust getSession (true if WS open + mywsid)
        w.getMyWsId=function(){return mywsid;};
        w.getMyId=function(){return myid;};
        w.getSession=function(){ return sessionOpen || mywsid!=null; };
        w.getPlayers=function(){return Array.from(roster.values());};
        w.getPlayer=function(id){return id!=null ? (roster.get(String(id))||null):null;};
        w.getPlayerCount=function(){return roster.size;};
        w.getDrawTurn=function(){return drawTurn;};
        w.selectWord=function(index){
            const sid=w.getMyWsId();
            // allow if we have sid, even if sessionOpen was derived via 5
            if (sid==null) { console.warn('%c[api] selectWord: no sid','color:#c0392b'); return false; }
            const max=(drawTurn&&drawTurn.words.length)||2;
            if(!Number.isInteger(index)||index<0||index>=max){ console.warn('%c[api] selectWord bad index','color:#c0392b',index); return false; }
            return w.sendWS('42["34",'+sid+','+index+']');
        };
        w.simKick=function(target,voter,dry){ try{ w.dispatchEvent(new CustomEvent('api-kick',{detail:{target, voters:[voter], vote:1, dry:!!dry, raw:null}})); return true;}catch(e){return false;} };
        // Attach — since hub is sync, we can attach immediately
        if (typeof w.onWS === 'function') w.onWS(handleMessage);
        else console.warn('%c[api] onWS missing! hub not ready','color:#c0392b');
        // Late recovery: if WS already open and we have mywsid in page's existing state (e.g., after SPA), ensure session
        setTimeout(()=>{ try{ if(!sessionOpen && w.wsHubGetSocket && w.wsHubGetSocket() && w.wsHubGetSocket().readyState===1 && mywsid!=null) setSession(true); }catch(e){} }, 500);
        console.log('%c[api] omni api v2 ready (session robust)','color:#f39c12;font-weight:bold');
    })();

    // ============================================================
    // 2b) ORBIT API — hybrid minimal (verify/hub/api/store/events)
    //     Pluginler w.Orbit üzerinden erişir, direkt w.* minimal kullanım
    // ============================================================
    (function () {
        if (w.Orbit) return;
        const ORBIT_SECRET = 'orbit_v1_' + '9f3a7c2e1d5b8a4f'; // build'de obfuscate edilecek
        w.__orbitAuth = {
            verify: function (id) {
                if (!id || !w.__orbitCore) return null;
                // simple token: id + secret hash (gerçekte HMAC, şimdilik string)
                return 'ok:' + id + ':' + ORBIT_SECRET.slice(0, 8);
            }
        };
        w.Orbit = {
            version: '1.0.0',
            // verify — plugin ilk satırda çağırır, null ise abort
            verify: function (id) { return w.__orbitAuth.verify(id); },
            // hub — Voyager/Orbit singleton, plugin direkt w.sendWS kullanmamalı
            hub: {
                sendWS: function (d) { return w.sendWS(d); },
                onWS: function (cb) { return w.onWS(cb); },
                offWS: function (cb) { return w.offWS(cb); },
                onWSSend: function (cb) { return w.onWSSend(cb); },
                offWSSend: function (cb) { return w.offWSSend(cb); },
                getSocket: function () { return w.wsHubGetSocket(); },
                get verbose() { return w.wsHubVerbose; },
                set verbose(v) { w.wsHubVerbose = v; }
            },
            // api — session/roster/drawTurn, plugin direkt w.get* kullanmamalı
            api: {
                getMyWsId: function () { return w.getMyWsId(); },
                getMyId: function () { return w.getMyId(); },
                getSession: function () { return w.getSession(); },
                getPlayers: function () { return w.getPlayers(); },
                getPlayer: function (id) { return w.getPlayer(id); },
                getPlayerCount: function () { return w.getPlayerCount(); },
                getDrawTurn: function () { return w.getDrawTurn(); },
                selectWord: function (i) { return w.selectWord(i); },
                onPkt: function (cb) { return w.onPkt(cb); },
                offPkt: function (cb) { return w.offPkt(cb); }
            },
            // store — per-plugin prefix yok, global; VM'de window.GM_* prefix'li, w.Orbit.store global
            store: {
                get: function (k, d) { try { return gGet(k, d); } catch (e) { return d; } },
                set: function (k, v) { try { gSet(k, v); } catch (e) {} }
            },
            // events — Orbit event bus (ws-session-*, api-*)
            events: {
                on: function (ev, cb) { w.addEventListener(ev, cb); },
                off: function (ev, cb) { w.removeEventListener(ev, cb); },
                emit: function (ev, detail) { try { w.dispatchEvent(new CustomEvent(ev, { detail: detail })); } catch (e) {} }
            },
            // exec — gerekirse Orbit VM'inde kod yürütme (pluginler nadir kullanır)
            exec: {
                run: function (code) { try { return Function(code)(); } catch (e) { console.error('[orbit] exec fail', e); return null; } }
            }
        };
        // backward compat: w.sendWS etc. hala var, ama yeni pluginler w.Orbit.* kullanır
        console.log('%c[orbit] Orbit API v1.0.0 ready — w.Orbit.{verify,hub,api,store,events,exec}', 'color:#8e44ad;font-weight:bold');
    })();

    function isFirstTime() {
        try {
            const w = gGet(STORE_WELCOME, null);
            const a = gGet(STORE_AGREED, null);
            if (w && typeof w.then === 'function') return true;
            return !w || !a;
        } catch (e) { return true; }
    }

    function injectStyles() {
        if (document.getElementById('omni-gui-styles')) return;
        const s = document.createElement('style');
        s.id = 'omni-gui-styles';
        s.textContent = `
            #omni-overlay{position:fixed !important;inset:0 !important;z-index:2147483647 !important;background:rgba(0,0,0,.72) !important;display:flex !important;align-items:center !important;justify-content:center !important;font-family:Arial,sans-serif !important;backdrop-filter:blur(2px) !important;}
            #omni-card{width:440px !important;max-width:92vw !important;background:#ffffff !important;border:none !important;border-radius:16px !important;overflow:hidden !important;box-shadow:0 20px 60px rgba(0,0,0,.4) !important;color:#2c3e50 !important;animation:omniIn .25s ease !important;}
            @keyframes omniIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
            #omni-head{padding:16px 20px !important;background:#0f1419 !important;color:#fff !important;font:700 15px Arial !important;display:flex !important;align-items:center !important;justify-content:space-between !important;border-bottom:1px solid #2c3e50 !important;}
            #omni-body{padding:20px !important;display:flex !important;flex-direction:column !important;gap:16px !important;max-height:72vh !important;overflow:auto !important;background:#fff !important;}
            #omni-card #omni-title{color:#0f1419 !important;}
            #omni-card #omni-desc{color:#636e72 !important;}
            #omni-card #omni-agreements-box{border-color:#dfe6e9 !important;background:#f8f9fa !important;color:#636e72 !important;}
            #omni-card #omni-alert-box{border-color:#ffeaa7 !important;background:#fef9e7 !important;color:#6c5b00 !important;}
            #omni-title{font:700 18px Arial;color:#fff;margin:0;}
            #omni-desc{font:13px/1.5 Arial;color:#b2bec3;margin:0;}
            #omni-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:4px;}
            .omni-btn{padding:10px 18px;border:none;border-radius:8px;font:700 13px Arial;cursor:pointer;transition:opacity .2s,filter .2s;}
            .omni-btn:disabled{opacity:.38;cursor:not-allowed;filter:grayscale(.2);}
            .omni-btn-primary{background:#2c3e50;color:#fff;} .omni-btn-primary:hover:not(:disabled){background:#34495e;}
            .omni-btn-primary:disabled{background:#2c3e50;color:#7f8c8d;}
            .omni-btn-ghost{background:#2c3e50;color:#ecf0f1;}
            .omni-check{display:flex;gap:8px;align-items:flex-start;font:12px Arial;color:#95a5a6;cursor:pointer;}
            .omni-check input{accent-color:#2c3e50;margin-top:2px;}
            #omni-agreements-box{border:1px solid #34495e;background:#0f1419;border-radius:8px;padding:12px;min-height:90px;max-height:180px;overflow:auto;font:12px/1.5 Arial;color:#7f8c8d;}
            #omni-alert-box{border:1px solid #e67e22;background:#1e272e;border-radius:8px;padding:12px;min-height:60px;max-height:180px;overflow:auto;font:13px/1.5 Arial;color:#f5b041;}
            #omni-settings-btn{position:fixed !important;bottom:18px !important;right:18px !important;top:auto !important;left:auto !important;z-index:2147483647 !important;width:44px !important;height:44px !important;background:#0f1419 !important;border:2px solid #fff !important;border-radius:50% !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;box-shadow:0 4px 20px rgba(0,0,0,.35) !important;font-size:18px !important;color:#fff !important;box-sizing:border-box !important;transition:transform .15s !important;}
            #omni-settings-btn:hover{transform:scale(1.06) !important;background:#1e272e !important;}
            #omni-settings-panel{position:fixed !important;bottom:70px !important;right:18px !important;top:auto !important;left:auto !important;z-index:2147483647 !important;width:260px !important;max-width:92vw !important;background:#ffffff !important;border:none !important;border-radius:12px !important;box-shadow:0 12px 32px rgba(0,0,0,.25) !important;display:none !important;overflow:hidden !important;font-family:Arial,sans-serif !important;box-sizing:border-box !important;}
            #omni-settings-head{padding:10px 14px;background:#0f1419;color:#ecf0f1;border-bottom:1px solid #2c3e50;font:700 12px Arial;display:flex;align-items:center;justify-content:space-between;}
            #omni-settings-body{padding:12px;display:flex;flex-direction:column;gap:10px;background:#1e272e;}
            .omni-theme-row{display:flex;gap:8px;}
            .omni-theme-opt{flex:1;padding:10px;border:1px solid #34495e;border-radius:8px;background:#0f1419;color:#95a5a6;font:12px Arial;cursor:pointer;text-align:center;}
            .omni-theme-opt.active{border-color:#ecf0f1;background:#ecf0f1;color:#0f1419;}
            #omni-settings-panel.light{background:#ffffff;border-color:#bdc3c7;}
            #omni-settings-panel.light #omni-settings-head{background:#f1f2f6;color:#2c3e50;border-bottom:1px solid #bdc3c7;}
            #omni-settings-panel.light #omni-settings-body{background:#f8f9fa;}
            #omni-settings-panel.light .omni-theme-opt{background:#ffffff;border-color:#bdc3c7;color:#636e72;}
            #omni-settings-panel.light .omni-theme-opt.active{background:#2c3e50;color:#fff;border-color:#2c3e50;}
            #omni-plugin-list{display:flex;flex-direction:column;gap:8px;max-height:180px;overflow:auto;}
            .omni-plugin-row{display:flex;gap:8px;align-items:flex-start;padding:8px;background:#0f1419;border:1px solid #34495e;border-radius:8px;cursor:pointer;}
            #omni-settings-panel.light .omni-plugin-row{background:#fff;border-color:#bdc3c7;}
            .omni-plugin-row input{margin-top:2px;accent-color:#2c3e50;}
            .omni-plugin-info{flex:1;}
            .omni-plugin-name{font:700 12px Arial;color:#ecf0f1;}
            #omni-settings-panel.light .omni-plugin-name{color:#2c3e50;}
            .omni-plugin-desc{font:11px Arial;color:#95a5a6;}
            #omni-settings-panel.light .omni-plugin-desc{color:#636e72;}
        `;
        document.head.appendChild(s);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'omni-overlay';
        overlay.innerHTML = `
            <div id="omni-card">
                <div id="omni-head">
                    <span id="omni-head-title">Welcome to Omni</span>
                    <span data-omni-action="close-overlay" style="cursor:pointer;font-size:20px;line-height:1;">×</span>
                </div>
                <div id="omni-body"></div>
            </div>
        `;
        return overlay;
    }

    function ensureBody(cb) {
        if (document.body) cb();
        else setTimeout(() => ensureBody(cb), 100);
    }

    function showWelcome(onNext) {
        injectStyles();
        const overlay = createOverlay();
        const body = overlay.querySelector('#omni-body');
        body.innerHTML = `
            <h2 id="omni-title">Welcome to Omni</h2>
            <p id="omni-desc">Omni is your universal Gartic ecosystem core — single file, auto-updates, plugin manager.<br>First, choose your default theme.</p>
            <div style="font:700 11px Arial;color:#95a5a6;margin-top:4px;">DEFAULT THEME</div>
            <div class="omni-theme-row" id="omni-welcome-themes">
                <div class="omni-theme-opt" data-theme="black">Black</div>
                <div class="omni-theme-opt" data-theme="white">White</div>
            </div>
            <div id="omni-actions">
                <button class="omni-btn omni-btn-primary" data-omni-action="welcome-next">Next →</button>
            </div>
        `;
        let selectedTheme = gGet(STORE_THEME, 'black');
        if (selectedTheme && typeof selectedTheme.then === 'function') selectedTheme = 'black';
        else selectedTheme = selectedTheme || 'black';

        ensureBody(() => {
            document.body.appendChild(overlay);
            updateWelcomeTheme(overlay, selectedTheme);
        });

        function updateWelcomeTheme(ov, th) {
            ov.querySelectorAll('#omni-welcome-themes .omni-theme-opt').forEach(el => el.classList.toggle('active', el.dataset.theme === th));
        }

        // Overlay specific click handler
        overlay.addEventListener('click', (e) => {
            const action = e.target.closest('[data-omni-action]');
            if (!action) {
                // Theme selection
                const themeOpt = e.target.closest('.omni-theme-opt');
                if (themeOpt && themeOpt.parentElement.id === 'omni-welcome-themes') {
                    selectedTheme = themeOpt.dataset.theme;
                    updateWelcomeTheme(overlay, selectedTheme);
                }
                return;
            }
            const act = action.dataset.omniAction;
            if (act === 'close-overlay') overlay.remove();
            if (act === 'welcome-next') {
                gSet(STORE_THEME, selectedTheme);
                applyTheme(selectedTheme);
                overlay.remove();
                gSet(STORE_WELCOME, true);
                onNext && onNext();
            }
        });
    }

    function showAgreements(onAccept) {
        injectStyles();
        const overlay = createOverlay();
        overlay.querySelector('#omni-head-title').textContent = 'Agreements';
        const body = overlay.querySelector('#omni-body');
        body.innerHTML = `
            <p id="omni-desc">Please review and accept the agreements to continue.</p>
            <div id="omni-agreements-box">
                ${typeof EMBEDDED_AGREEMENTS !== 'undefined' ? EMBEDDED_AGREEMENTS : '<em>Agreements placeholder</em>'}
            </div>
            <label class="omni-check">
                <input type="checkbox" id="omni-agree-check">
                <span>I have read and accept the agreements</span>
            </label>
            <div id="omni-actions">
                <button class="omni-btn omni-btn-ghost" data-omni-action="agreements-back">Back</button>
                <button class="omni-btn omni-btn-primary" data-omni-action="agreements-accept" disabled>Accept & Continue</button>
            </div>
        `;
        ensureBody(() => { document.body.appendChild(overlay); });

        overlay.addEventListener('click', (e) => {
            const check = overlay.querySelector('#omni-agree-check');
            const acceptBtn = overlay.querySelector('[data-omni-action="agreements-accept"]');

            // Checkbox change handling via click delegation
            if (e.target.id === 'omni-agree-check') {
                acceptBtn.disabled = !e.target.checked;
                return;
            }

            const action = e.target.closest('[data-omni-action]');
            if (!action) return;
            const act = action.dataset.omniAction;

            if (act === 'close-overlay') overlay.remove();
            if (act === 'agreements-back') {
                overlay.remove();
                showWelcome(() => showAgreements(onAccept));
            }
            if (act === 'agreements-accept') {
                if (!check.checked) return;
                overlay.remove();
                gSet(STORE_AGREED, true);
                gSet(STORE_WELCOME, true);
                console.log('[omni] agreements accepted');
                onAccept && onAccept();
            }
        });
    }

    const EMBEDDED_ALERTS = { version: "1.1-test", alerts: [{ title: "Test Alert", message: "This is a test alert — if you see this box, the alerts system works! (One-time)" }] };
    const EMBEDDED_AGREEMENTS = `<em>Agreements content embedded — later will be fetched from server.</em><br><br>By using Omni you agree to the terms.`;

    function fetchAlerts(cb, eb) { setTimeout(() => cb(JSON.stringify(EMBEDDED_ALERTS)), 10); }

    function showAlerts(alerts, onClose) {
        if (!alerts || !alerts.length) { onClose && onClose(); return; }
        const overlay = document.createElement('div');
        overlay.id = 'omni-overlay';
        overlay.innerHTML = `
            <div id="omni-card">
                <div id="omni-head"><span>Alerts</span><span data-omni-action="close-overlay" style="cursor:pointer;font-size:20px;">×</span></div>
                <div id="omni-body">
                    <div id="omni-alert-box">${alerts.map(a => `<div style="margin-bottom:8px;"><strong>${a.title || 'Alert'}:</strong> ${a.message || ''}</div>`).join('')}</div>
                    <div id="omni-actions"><button class="omni-btn omni-btn-primary" data-omni-action="alert-ok">OK</button></div>
                </div>
            </div>
        `;
        ensureBody(() => { document.body.appendChild(overlay); });
        overlay.addEventListener('click', (e) => {
            const action = e.target.closest('[data-omni-action]');
            if (action && (action.dataset.omniAction === 'close-overlay' || action.dataset.omniAction === 'alert-ok')) {
                overlay.remove();
                onClose && onClose();
            }
        });
    }

    function checkAndShowAlerts(cb) {
        fetchAlerts(txt => {
            let data; try { data = JSON.parse(txt); } catch (e) { cb && cb(); return; }
            const ver = data.version || JSON.stringify(data.alerts);
            const stored = gGet(STORE_ALERTS_VER, null);
            if (stored && typeof stored.then === 'function') {
                Promise.resolve(stored).then(s => { if (s === ver) { cb && cb(); return; } gSet(STORE_ALERTS_VER, ver); showAlerts(data.alerts, cb); });
                return;
            }
            if (stored === ver) { cb && cb(); return; }
            gSet(STORE_ALERTS_VER, ver);
            if (!data.alerts || !data.alerts.length) { cb && cb(); return; }
            showAlerts(data.alerts, cb);
        }, () => { cb && cb(); });
    }

    function applyTheme(theme) {
        if (theme === 'gray') theme = 'black';
        const panel = document.getElementById('omni-settings-panel');
        if (panel) {
            panel.classList.remove('light', 'gray');
            if (theme === 'white') panel.classList.add('light');
        }
        gSet(STORE_THEME, theme);
        document.querySelectorAll('.omni-theme-opt').forEach(el => { el.classList.toggle('active', el.dataset.theme === theme); });
        const overlay = document.getElementById('omni-overlay');
        if (overlay) {
            const card = overlay.querySelector('#omni-card');
            if (card) card.style.filter = theme === 'white' ? 'brightness(1.05)' : theme === 'gray' ? 'brightness(0.95) saturate(0.9)' : 'none';
        }
    }

    /* ==========================================
       FIXED: ROBUST SETTINGS UI & EVENT DELEGATION
       ========================================== */
    function ensureSettingsUI() {
        if (document.getElementById('omni-settings-btn')) return;
        if (!document.body) {
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureSettingsUI, { once: true });
            else setTimeout(ensureSettingsUI, 200);
            return;
        }

        injectStyles();

        const btn = document.createElement('div');
        btn.id = 'omni-settings-btn';
        btn.textContent = '⚙';
        btn.title = 'Omni Settings';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'omni-settings-panel';
        panel.innerHTML = `
            <div id="omni-settings-head">
                <span>Settings</span>
                <span data-omni-action="settings-close" style="cursor:pointer;">×</span>
            </div>
            <div id="omni-settings-body">
                <div style="font:700 11px Arial;color:#95a5a6;">THEME</div>
                <div class="omni-theme-row" id="omni-settings-themes">
                    <div class="omni-theme-opt" data-theme="black">Black</div>
                    <div class="omni-theme-opt" data-theme="white">White</div>
                </div>
                <div style="height:1px;background:#34495e;margin:4px 0;"></div>
                <div style="font:700 11px Arial;color:#95a5a6;">PLUGINS</div>
                <button class="omni-btn omni-btn-ghost" data-omni-action="manage-plugins" style="width:100%;">Manage Plugins</button>
                <div id="omni-version-info" style="margin-top:8px;padding:8px;background:#0f1419;border:1px solid #2c3e50;border-radius:6px;font:10px/1.4 monospace;color:#7f8c8d;text-align:center;word-break:break-all;"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const stored = gGet(STORE_THEME, 'black');
        const theme = (stored && typeof stored.then === 'function') ? 'black' : (stored || 'black');
        setTimeout(()=>{
            const info=document.getElementById('omni-version-info');
            if(info){
                const ver=(typeof GM_info!=='undefined'&&GM_info.script.version)||'1.0.1';
                try{
                    const plugins=PLUGINS.map(p=>p.id+':'+(p.version||'?')).join(' | ');
                    info.textContent='Omni v'+ver+' | '+plugins;
                }catch(e){ info.textContent='Omni v'+ver; }
            }
        }, 400);
        if (stored && typeof stored.then === 'function') Promise.resolve(stored).then(v => applyTheme(v || 'black'));
        else applyTheme(theme);
    }

    // SPA survival: MutationObserver re-adds settings button if Gartic SPA wipes DOM
    (function(){
        let obs=null;
        function startObs(){
            if(obs) return;
            if(!document.body) return setTimeout(startObs, 500);
            obs = new MutationObserver(()=>{
                if(!document.getElementById('omni-settings-btn')){
                    // debounce
                    setTimeout(()=>{ if(!document.getElementById('omni-settings-btn')) ensureSettingsUI(); }, 300);
                }
            });
            try{ obs.observe(document.body, {childList:true, subtree:false}); }catch(e){}
            // also watch history pushState (Gartic.io SPA)
            try{
                const origPush = history.pushState;
                history.pushState = function(){ const r=origPush.apply(this, arguments); setTimeout(ensureSettingsUI, 400); return r; };
                window.addEventListener('popstate', ()=> setTimeout(ensureSettingsUI, 400));
            }catch(e){}
        }
        if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', startObs);
        else setTimeout(startObs, 800);
    })();

    // GLOBAL EVENT DELEGATION (Capture Phase) - Survives SPA DOM mutations
    document.addEventListener('click', (e) => {
        const btn = document.getElementById('omni-settings-btn');
        const panel = document.getElementById('omni-settings-panel');

        // Toggle settings panel
        if (btn && btn.contains(e.target)) {
            e.stopPropagation();
            if (panel) panel.style.setProperty('display', (panel.style.getPropertyValue('display')==='block' || panel.style.display==='block') ? 'none' : 'block', 'important');
            return;
        }

        // Inside panel actions
        if (panel && panel.contains(e.target)) {
            const action = e.target.closest('[data-omni-action]');
            if (action) {
                const act = action.dataset.omniAction;
                if (act === 'settings-close') panel.style.setProperty('display','none','important');
                if (act === 'manage-plugins') {
                    panel.style.setProperty('display','none','important');
                    showPluginMenu((sel) => { if (sel) console.log('[omni] plugins updated', sel); });
                }
            }
            // Theme selection inside settings
            const themeOpt = e.target.closest('.omni-theme-opt');
            if (themeOpt && themeOpt.parentElement.id === 'omni-settings-themes') {
                applyTheme(themeOpt.dataset.theme);
            }
            return;
        }

        // Outside click to close panel
        if (panel && (panel.style.getPropertyValue('display')==='block' || panel.style.display==='block')) {
            panel.style.setProperty('display','none','important');
        }
    }, true); // capture: true ensures we catch events before Gartic.io handlers stop propagation

    /* ==========================================
       PLUGIN LOADER (UNCHANGED CORE LOGIC)
       ========================================== */
    function fetchText(url, cb, eb) {
        const full = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: full, headers: { 'Cache-Control': 'no-cache' }, timeout: 10000, onload: r => { if (r.status >= 200 && r.status < 400 && r.responseText) cb(r.responseText); else eb && eb('status ' + r.status); }, onerror: () => eb && eb('onerror'), ontimeout: () => eb && eb('timeout') });
            } else if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                GM.xmlHttpRequest({ method: 'GET', url: full, onload: r => { if (r.status >= 200 && r.status < 400 && r.responseText) cb(r.responseText); else eb && eb('status'); }, onerror: () => eb && eb('onerror') });
            } else {
                fetch(full, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('fetch ' + r.status); return r.text(); }).then(cb).catch(e => eb && eb(String(e)));
            }
        } catch (e) { eb && eb(String(e)); }
    }

    const vmInstances = {};
    function createVM(pluginId){
        const realWindow = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
        const vmWindow = Object.create(realWindow);
        const tracked = new Set();
        // Per-plugin storage prefix isolation
        const prefix = 'omni_plugin_'+pluginId+'__';
        function prefixedGet(k,d){
            const pk = prefix+k;
            try{ if(typeof GM_getValue==='function'){ const v=GM_getValue(pk,d); if(v!==undefined && !(v&&typeof v.then==='function')) return v; }}catch(e){}
            try{ const v=localStorage.getItem(pk); if(v!==null){ try{return JSON.parse(v);}catch(e){return v;}} }catch(e){}
            return d;
        }
        function prefixedSet(k,v){
            const pk = prefix+k;
            try{ if(typeof GM_setValue==='function'){ GM_setValue(pk,v); return; } }catch(e){}
            try{ localStorage.setItem(pk, typeof v==='string'?v:JSON.stringify(v)); }catch(e){}
        }
        // Track onWS listeners for this VM to allow clean unload
        const onWSListeners = [];
        const origOnWS = realWindow.onWS;
        const origOffWS = realWindow.offWS;
        // Wrap onWS to track
        function trackedOnWS(cb){
            if(typeof cb==='function') onWSListeners.push(cb);
            return origOnWS ? origOnWS(cb) : (realWindow.onWS ? realWindow.onWS(cb) : null);
        }
        function trackedOffWS(cb){
            const idx=onWSListeners.indexOf(cb);
            if(idx>-1) onWSListeners.splice(idx,1);
            return origOffWS ? origOffWS(cb) : null;
        }
        // Prefixed GM shims that plugins can use via window.GM_getValue etc. inside VM
        vmWindow.GM_getValue = (k,d)=> prefixedGet(k,d);
        vmWindow.GM_setValue = (k,v)=> prefixedSet(k,v);
        try{ vmWindow.GM = { getValue: (k,d)=> Promise.resolve(prefixedGet(k,d)), setValue: (k,v)=> { prefixedSet(k,v); return Promise.resolve(); } }; }catch(e){}
        const handler = {
            get(target, prop){
                if(prop==='onWS') return trackedOnWS;
                if(prop==='offWS') return trackedOffWS;
                if(prop==='GM_getValue') return prefixedGet;
                if(prop==='GM_setValue') return prefixedSet;
                if(prop in target) return target[prop];
                return realWindow[prop];
            },
            set(target, prop, value){
                tracked.add(prop);
                target[prop]=value;
                try{ realWindow[prop]=value; }catch(e){}
                return true;
            },
            has(target, prop){ return prop in target || prop in realWindow; }
        };
        const proxy = new Proxy(vmWindow, handler);
        return {proxy, tracked, vmWindow, realWindow, onWSListeners, prefix};
    }
    function executePlugin(code, src, mustContain, pluginId){
        if(mustContain && code.indexOf(mustContain)===-1){ console.warn('[omni] plugin anti-tamper fail',src); return false; }
        if(pluginId && vmInstances[pluginId]){
            try{ delete vmInstances[pluginId]; }catch(e){}
        }
        // Omni-aware plugins (those that check __omniWsHub) can run safely in VM — no page context needed.
        // Only legacy non-omni scripts need page context for WebSocket. Detect omni guard to avoid double patch.
        const isOmniAware = code.indexOf('__omniWsHub')!==-1 || code.indexOf('__omniHubReady')!==-1;
        const needsPageContext = !isOmniAware && (code.indexOf('WebSocket')!==-1 || code.indexOf('unsafeWindow')!==-1);
        if(needsPageContext){
            try{
                const realWindow = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
                const script = document.createElement('script');
                script.textContent = code + '\n//# sourceURL='+src;
                // Try to inject into page's documentElement for earliest execution
                (document.documentElement||document.head||document.body).appendChild(script);
                // Keep reference for unload (remove script tag, but patched WebSocket remains — need to handle unload separately)
                const vm = {proxy: realWindow, tracked: new Set(), vmWindow: realWindow, realWindow, scriptEl: script};
                if(pluginId) vmInstances[pluginId]=vm;
                console.log('[omni] plugin injected into page context (legacy)',src, pluginId);
                return true;
            }catch(e){
                console.warn('[omni] page inject fail, falling back to VM',e);
            }
        }
        const vm = createVM(pluginId);
        if(pluginId) vmInstances[pluginId]=vm;
        try{
            const exec = Function('window','document','unsafeWindow', code+'\n//# sourceURL='+src);
            const realWindow = vm.realWindow;
            const uw = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : realWindow);
            exec(vm.proxy, document, uw);
            console.log('[omni] plugin executed in VM',src, pluginId);
            return true;
        }catch(e){
            console.error('[omni] plugin VM execute fail',src,e);
            try{ Function(code+'\n//# sourceURL='+src)(); console.log('[omni] plugin executed fallback',src); return true; }catch(e2){ console.error('[omni] fallback fail',e2); return false; }
        }
    }
    function unloadPluginVM(pluginId){
        const vm = vmInstances[pluginId];
        try{ delete window.__garticPixelStandalone; }catch(e){}
        try{ delete window.__garticPixelLean; }catch(e){}
        try{ const uw=(typeof unsafeWindow!=='undefined'?unsafeWindow:window); if(uw!==window){ try{ delete uw.__garticPixelStandalone; }catch(e){} try{ delete uw.__garticPixelLean; }catch(e){} } }catch(e){}
        try{ if(window.drawTurn) window.drawTurn=null; }catch(e){}
        try{ const uw=(typeof unsafeWindow!=='undefined'?unsafeWindow:window); if(uw.drawTurn) uw.drawTurn=null; }catch(e){}
        if(!vm){
            console.log('[omni] VM unloaded (no vm) ',pluginId);
            return;
        }
        // Remove onWS listeners that were added by this VM
        try{
            if(vm.onWSListeners){
                vm.onWSListeners.forEach(cb=>{
                    try{ if(window.offWS) window.offWS(cb); }catch(e){}
                    try{ const uw=(typeof unsafeWindow!=='undefined'?unsafeWindow:window); if(uw!==window && uw.offWS) uw.offWS(cb); }catch(e){}
                });
            }
        }catch(e){}
        try{
            if(vm.scriptEl && vm.scriptEl.parentNode) try{ vm.scriptEl.remove(); }catch(e){}
            if(vm.tracked) vm.tracked.forEach(prop=>{
                try{ delete vm.vmWindow[prop]; }catch(e){}
                try{ if(vm.realWindow && vm.realWindow[prop]===vm.proxy[prop]) delete vm.realWindow[prop]; }catch(e){}
            });
            // Try to remove onWS listeners that were added by this plugin
            // We cannot know which listener, so we clear all and re-add loader's own if needed
            // For now, just log — the Hub's listeners will be re-added on next load
        }catch(e){}
        delete vmInstances[pluginId];
        console.log('[omni] VM unloaded',pluginId);
    }

    function loadPlugin(plugin, cb) {
        fetchText(plugin.url, code => {
            if (executePlugin(code, plugin.url, plugin.mustContain, plugin.id)) cb && cb(true);
            else if (plugin.fallback) fetchText(plugin.fallback, code2 => { cb && cb(executePlugin(code2, plugin.fallback, plugin.mustContain, plugin.id)); }, () => cb && cb(false));
            else cb && cb(false);
        }, err => {
            console.warn('[omni] plugin fetch fail', plugin.id, err);
            if (plugin.fallback) fetchText(plugin.fallback, code => { cb && cb(executePlugin(code, plugin.fallback, plugin.mustContain, plugin.id)); }, () => cb && cb(false));
            else cb && cb(false);
        });
    }

    function showPluginMenu(onDone) {
        injectStyles();
        const overlay = document.createElement('div');
        overlay.id = 'omni-overlay';
        overlay.innerHTML = `
            <div id="omni-card">
                <div id="omni-head"><span>Plugins</span><span data-omni-action="close-overlay" style="cursor:pointer;font-size:20px;">×</span></div>
                <div id="omni-body">
                    <p id="omni-desc">Select which scripts to run. They will be fetched from GitHub each time.</p>
                    <div id="omni-plugin-list"></div>
                    <div id="omni-actions">
                        <button class="omni-btn omni-btn-ghost" data-omni-action="plugin-skip">Skip</button>
                        <button class="omni-btn omni-btn-primary" data-omni-action="plugin-install">Install & Run</button>
                    </div>
                </div>
            </div>
        `;
        ensureBody(() => { document.body.appendChild(overlay); });

        const list = overlay.querySelector('#omni-plugin-list');
        const stored = gGet(STORE_PLUGINS, null);
        let selected = [];
        const isPromise = stored && typeof stored.then === 'function';

        function render(selectedArr) {
            list.innerHTML = '';
            PLUGINS.forEach(p => {
                const row = document.createElement('label');
                row.className = 'omni-plugin-row';
                const checked = selectedArr.includes(p.id);
                row.innerHTML = `<input type="checkbox" value="${p.id}" ${checked ? 'checked' : ''}><div class="omni-plugin-info"><div class="omni-plugin-name">${p.name}</div><div class="omni-plugin-desc">${p.description}</div><div style="font:10px monospace;color:#7f8c8d;">${p.id}</div></div>`;
                list.appendChild(row);
            });
        }

        if (isPromise) Promise.resolve(stored).then(s => { try { selected = s ? JSON.parse(s) : []; } catch (e) { selected = []; } render(selected); });
        else { try { selected = stored ? JSON.parse(stored) : []; } catch (e) { selected = []; } render(selected); }

        overlay.addEventListener('click', (e) => {
            const action = e.target.closest('[data-omni-action]');
            if (!action) return;
            const act = action.dataset.omniAction;

            if (act === 'close-overlay') { overlay.remove(); onDone && onDone(null); }
            if (act === 'plugin-skip') { overlay.remove(); onDone && onDone([]); }
            if (act === 'plugin-install') {
                const prevRaw = gGet(STORE_PLUGINS, null);
                const isPrevPromise = prevRaw && typeof prevRaw.then === 'function';
                function doInstall(prevSelected) {
                    const checked = [...list.querySelectorAll('input:checked')].map(i => i.value);
                    const prevSet = new Set(prevSelected || []);
                    const newSet = new Set(checked);
                    prevSet.forEach(id => {
                        if (!newSet.has(id)) {
                            // VM unload
                            try{ unloadPluginVM(id); }catch(e){}
                            if (id === 'test-payload') {
                                const el = document.getElementById('gartic-test-working');
                                if (el) el.remove();
                                // VM already cleared, but also clear global flag for non-VM fallback
                                try{ delete window.__garticTestPayloadLoaded; }catch(e){}
                                try{ if(vmInstances[id]) delete vmInstances[id]; }catch(e){}
                            }
                            try { gSet('omni_plugin_' + id, ''); gSet('omni_plugin_' + id + '_prev', ''); } catch (ex) {}
                        }
                    });
                    gSet(STORE_PLUGINS, JSON.stringify(checked));
                    overlay.remove();
                    let idx = 0;
                    function next() {
                        if (idx >= checked.length) { onDone && onDone(checked); return; }
                        const plug = PLUGINS.find(p => p.id === checked[idx]);
                        if (!plug) { idx++; next(); return; }
                        loadPlugin(plug, () => { idx++; next(); });
                    }
                    next();
                }
                if (isPrevPromise) Promise.resolve(prevRaw).then(v => { let ps = []; try { ps = v ? JSON.parse(v) : []; } catch (ex) {} doInstall(ps); });
                else { let ps = []; try { ps = prevRaw ? JSON.parse(prevRaw) : []; } catch (ex) {} doInstall(ps); }
            }
        });
    }

    function loadSelectedPlugins() {
        const stored = gGet(STORE_PLUGINS, null);
        const isPromise = stored && typeof stored.then === 'function';
        function doLoad(sel) { if (!sel || !sel.length) return; sel.forEach(id => { const plug = PLUGINS.find(p => p.id === id); if (plug) loadPlugin(plug, () => {}); }); }
        if (isPromise) Promise.resolve(stored).then(s => { try { doLoad(s ? JSON.parse(s) : null); } catch (e) {} });
        else { try { doLoad(stored ? JSON.parse(stored) : null); } catch (e) {} }
    }

    function boot() {
        const welcomeDone = gGet(STORE_WELCOME, false);
        const agreed = gGet(STORE_AGREED, false);
        const isPromise = welcomeDone && typeof welcomeDone.then === 'function';

        function afterOnboarding() { checkAndShowAlerts(() => { console.log('[omni] boot completed'); }); }

        function proceedAfterAgreements() {
            const hasPlugins = gGet(STORE_PLUGINS, null);
            const isP = hasPlugins && typeof hasPlugins.then === 'function';
            function proceed() { afterOnboarding(); ensureSettingsUI(); loadSelectedPlugins(); }
            if (isP) Promise.resolve(hasPlugins).then(v => { if (!v) showPluginMenu(() => { proceed(); }); else proceed(); });
            else { if (!hasPlugins) showPluginMenu(() => { proceed(); }); else proceed(); }
        }

        if (isPromise) {
            Promise.resolve(welcomeDone).then(w => {
                Promise.resolve(agreed).then(a => {
                    if (!w || !a) showWelcome(() => showAgreements(() => { console.log('[omni] first-time flow completed'); proceedAfterAgreements(); }));
                    else { afterOnboarding(); ensureSettingsUI(); loadSelectedPlugins(); }
                });
            });
            return;
        }

        if (!welcomeDone || !agreed) {
            showWelcome(() => showAgreements(() => { console.log('[omni] first-time flow completed'); proceedAfterAgreements(); }));
        } else {
            afterOnboarding();
            ensureSettingsUI();
            loadSelectedPlugins();
        }
        setTimeout(ensureSettingsUI, 800);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else setTimeout(boot, 400);

    console.log('[omni] loaded v2.0.0-rewrite');
})();
