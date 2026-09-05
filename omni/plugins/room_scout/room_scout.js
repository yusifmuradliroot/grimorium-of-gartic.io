// room_scout — live room browser from /req/list. Click a room to open its viewer.
// Active only on whowhere-like pages. Auto-refreshes. Manual code + history fallback.
// No WS needed, no dependencies.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('room_scout');
    if (!token || token.indexOf('room_scout') === -1) return;
    if (w.__roomScout) return;

    const RESERVED = { rooms: 1, create: 1, join: 1, viewer: 1, play: 1, theme: 1, apps: 1, list: 1, options: 1, privacy: 1, discord: 1, download: 1, gartic: 1, itunes: 1, instagram: 1, logout: 1, details: 1, service: 1, req: 1, id: 1, images: 1, app: 1 };
    const path = (location.pathname || '').toLowerCase();
    const browseMode = path.indexOf('whowhere') >= 0 || path.indexOf('rooms') >= 0;
    const segs = path.split('/').filter(s => s);
    const roomCode = (!browseMode && segs.length >= 1 && /^[a-z0-9]{3,8}$/.test(segs[0]) && !RESERVED[segs[0]]) ? segs[0] : null;
    if (!browseMode && !roomCode) return;
    w.__roomScout = true;

    const LIST_URL = 'https://gartic.io/req/list';
    const TS_SITEKEY = '0x4AAAAAABBPKaIbNwnPEfSo';
    const TS_API = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    let selLang = '', selSubj = '';
    let langEl = null, subjEl = null;
    const LANGMAP = {"langs": [{"id": 23, "name": "Azərbaycanca", "subjects": [1, 7]}, {"id": 45, "name": "Bahasa Indonesia", "subjects": [1, 7, 2, 3, 4, 16, 6, 26, 28, 35, 12, 31, 8, 14]}, {"id": 11, "name": "Čeština", "subjects": [1, 3, 2, 7, 4]}, {"id": 14, "name": "Deutsch", "subjects": [1, 3, 2, 7]}, {"id": 2, "name": "English", "subjects": [1, 3, 2, 4, 5, 6, 7, 16, 11, 14, 31, 19, 23, 26, 18, 35, 8, 12, 9, 37, 33]}, {"id": 3, "name": "Español", "subjects": [1, 3, 2, 4, 5, 6, 7, 37]}, {"id": 4, "name": "Français", "subjects": [1, 3, 2, 4, 5, 6, 7]}, {"id": 6, "name": "Italiano", "subjects": [1, 3, 2, 4, 5, 6, 7]}, {"id": 44, "name": "Magyar", "subjects": [1, 7]}, {"id": 18, "name": "Nederlands", "subjects": [1, 3, 2, 7]}, {"id": 10, "name": "Polski", "subjects": [1, 3, 2, 7]}, {"id": 1, "name": "Português", "subjects": [1, 3, 2, 4, 5, 6, 7, 31, 14, 16, 12, 17, 11, 8, 26, 23, 35, 18, 28, 9, 19, 32, 33, 37, 15, 27, 38, 13]}, {"id": 58, "name": "Română", "subjects": [1, 7]}, {"id": 22, "name": "Slovenčina", "subjects": [1, 3, 2, 7]}, {"id": 13, "name": "Tiếng Việt", "subjects": [1, 7]}, {"id": 8, "name": "Türkçe", "subjects": [1, 3, 2, 7, 4, 6, 16, 31, 14, 11, 5, 26]}, {"id": 21, "name": "български език", "subjects": [1, 3, 2, 7]}, {"id": 7, "name": "Русский", "subjects": [1, 3, 2, 7]}, {"id": 40, "name": "עברית", "subjects": [1, 7]}, {"id": 19, "name": "العربية", "subjects": [1, 7, 3]}, {"id": 34, "name": "فارسی", "subjects": [1, 7]}, {"id": 12, "name": "ภาษาไทย", "subjects": [1, 7, 2, 4, 3, 6]}, {"id": 16, "name": "中文 (简化字)", "subjects": [1, 3, 2, 7, 4, 6, 11, 31, 28]}, {"id": 9, "name": "中文 (臺灣)", "subjects": [1, 3, 2, 7, 4, 6, 31, 16, 28, 35]}, {"id": 17, "name": "中文 (香港)", "subjects": [1, 3, 2, 7, 4]}, {"id": 15, "name": "日本語", "subjects": [1, 7]}, {"id": 20, "name": "한국어", "subjects": [1, 3, 7]}], "subjects": {"30": "Others / Generic", "1": "General", "2": "Animals", "28": "Animes", "27": "Bands", "9": "Cartoons", "19": "Clash Royale", "38": "Crazy", "23": "Dota", "22": "Dragon Ball", "16": "Flags", "33": "FNAF", "4": "Foods", "17": "Football", "32": "Fortnite", "21": "Game of Thrones", "12": "Games", "37": "Halloween", "18": "Harry Potter", "6": "Jobs", "26": "Logos", "11": "LoL", "20": "Lord of Rings", "14": "Marvel / DC", "31": "Minecraft", "8": "Movies", "35": "Naruto", "3": "Objects", "13": "Personalities", "7": "Pokemon", "15": "Series", "10": "Songs", "29": "Sports", "34": "Star Wars", "25": "Streamers", "36": "The Sims", "5": "Verbs", "24": "Youtubers"}};
    const HIST_KEY = 'room_scout_history';
    const REFRESH_MS = 15000;
    let overlay = null, listEl = null, histEl = null, statusEl = null, timer = null;

    function getHist() {
        try {
            const v = localStorage.getItem(HIST_KEY);
            const a = v ? JSON.parse(v) : [];
            return Array.isArray(a) ? a : [];
        } catch (e) { return []; }
    }
    function saveHist(code) {
        try {
            const a = [code].concat(getHist().filter(c => c !== code)).slice(0, 20);
            localStorage.setItem(HIST_KEY, JSON.stringify(a));
        } catch (e) {}
    }
    function go(code) {
        code = (code || '').trim().replace(/^\//, '').replace(/\/viewer\/?$/, '');
        if (!/^[A-Za-z0-9]{3,8}$/.test(code)) return;
        saveHist(code);
        location.href = '/' + code + '/viewer';
    }
    function listURL() {
        let u = LIST_URL + '?_=' + Date.now();
        if (selLang !== '') u += '&language[]=' + encodeURIComponent(selLang);
        if (selSubj !== '') u += '&subject[]=' + encodeURIComponent(selSubj);
        return u;
    }
    function fetchRooms(cb) {
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: listURL(), timeout: 10000,
                    onload: r => {
                        try { cb(JSON.parse(r.responseText)); } catch (e) { cb(null); }
                    },
                    onerror: () => cb(null), ontimeout: () => cb(null) });
            } else {
                fetch(listURL(), { cache: 'no-store' }).then(r => r.json()).then(cb).catch(() => cb(null));
            }
        } catch (e) { cb(null); }
    }
    function fillSubjects() {
        if (!subjEl) return;
        subjEl.innerHTML = '';
        const all = document.createElement('option');
        all.value = '';
        all.textContent = 'All subjects';
        subjEl.appendChild(all);
        let ids = [];
        if (selLang === '') {
            ids = Object.keys(LANGMAP.subjects).map(Number);
        } else {
            const L = LANGMAP.langs.filter(l => String(l.id) === String(selLang))[0];
            ids = L ? L.subjects.slice() : [];
        }
        ids.sort((a, b) => String(LANGMAP.subjects[a] || '').localeCompare(String(LANGMAP.subjects[b] || '')));
        ids.forEach(id => {
            if (!LANGMAP.subjects[id]) return;
            const o = document.createElement('option');
            o.value = String(id);
            o.textContent = LANGMAP.subjects[id];
            subjEl.appendChild(o);
        });
        selSubj = '';
    }
    // ============ Background viewer join: token → socket → E5 players ============
    function ensureTurnstileAPI(cb) {
        if (w.turnstile && typeof w.turnstile.execute === 'function') { cb(true); return; }
        const s = document.createElement('script');
        let done = false;
        const to = setTimeout(() => { if (!done) { done = true; cb(false); } }, 10000);
        s.onload = () => { if (!done) { done = true; clearTimeout(to); cb(!!(w.turnstile && w.turnstile.execute)); } };
        s.onerror = () => { if (!done) { done = true; clearTimeout(to); cb(false); } };
        s.src = TS_API;
        document.head.appendChild(s);
    }
    function solveToken(cb) {
        ensureTurnstileAPI(ok => {
            if (!ok) { cb(null, 'ts-api missing'); return; }
            if (!document.body) { cb(null, 'no body'); return; }
            const box = document.createElement('div');
            box.style.cssText = 'position:fixed !important;left:8px !important;bottom:8px !important;width:65px !important;height:65px !important;overflow:hidden !important;opacity:.01 !important;z-index:1 !important;';
            document.body.appendChild(box);
            let wid = null, finished = false, tries = 0;
            const to = setTimeout(() => { if (!finished) { finished = true; cleanup(); cb(null, 'ts timeout'); } }, 35000);
            function cleanup() { try { if (wid !== null && wid !== undefined) w.turnstile.remove(wid); } catch (e) {} try { box.remove(); } catch (e) {} }
            function fail(stage) { if (!finished) { finished = true; clearTimeout(to); cleanup(); cb(null, stage); } }
            try {
                wid = w.turnstile.render(box, {
                    sitekey: TS_SITEKEY,
                    action: 'join',
                    appearance: 'interaction-only',
                    callback: tk => { if (!finished) { finished = true; clearTimeout(to); cleanup(); cb(tk); } },
                    'error-callback': () => { tries++; if (tries < 3) { try { w.turnstile.execute(wid); } catch (e) {} } else fail('ts widget error'); },
                    'expired-callback': () => fail('ts expired')
                });
            } catch (e) { fail('ts render throw'); return; }
            if (wid === null || wid === undefined) { fail('ts render empty'); return; }
            try { w.turnstile.execute(wid); }
            catch (e) { fail('ts execute throw'); }
        });
    }
    function cleanSocket() {
        // Hidden iframe = untouched native WebSocket (never hijacks the game hub).
        try {
            const fr = document.createElement('iframe');
            fr.style.cssText = 'display:none !important;width:0 !important;height:0 !important;border:none !important;';
            document.body.appendChild(fr);
            const WS = fr.contentWindow.WebSocket;
            return { WS: WS, drop: () => { try { fr.remove(); } catch (e) {} } };
        } catch (e) { return null; }
    }
    function fetchPlayers(room, cb) {
        // room: {id, code}. Viewer join on a throwaway socket, read E5, close.
        solveToken((tok, stage) => {
            if (!tok) { cb(null, stage || 'captcha failed'); return; }
            const cs = cleanSocket();
            if (!cs) { cb(null, 'socket blocked'); return; }
            let sock = null, done = false;
            const to = setTimeout(() => finish(null, 'timeout'), 20000);
            function finish(players, err) {
                if (done) return;
                done = true;
                clearTimeout(to);
                try { if (sock) sock.close(); } catch (e) {}
                try { cs.drop(); } catch (e) {}
                cb(players, err);
            }
            try {
                sock = new cs.WS('wss://gartic.io/socket.io/?EIO=3&transport=websocket');
            } catch (e) { finish(null, 'connect failed'); return; }
            sock.onopen = () => { try { sock.send('40'); } catch (e) {} };
            sock.onerror = () => finish(null, 'socket error');
            sock.onmessage = ev => {
                let msg = ev.data;
                if (typeof msg !== 'string') { try { msg = String(msg); } catch (e) { return; } }
                if (msg === '2') { try { sock.send('3'); } catch (e) {} return; }
                if (msg === '40' || msg.indexOf('40{') === 0) {
                    try { sock.send('42[12,{"v":20000,"token":"' + tok + '","platform":0,"sala":"' + room.id + '"}]'); } catch (e) {}
                    return;
                }
                if (msg.indexOf('42["5",') === 0) {
                    let players = null;
                    try {
                        const data = JSON.parse(msg.slice(msg.indexOf('42[') + 1));
                        if (Array.isArray(data) && Array.isArray(data[5])) players = data[5];
                    } catch (e) {}
                    if (players) finish(players, null);
                    else finish(null, 'parse failed');
                }
            };
        });
    }
    function row(room) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex !important;flex-direction:column !important;gap:0 !important;';
        const b = document.createElement('div');
        b.style.cssText = 'display:flex !important;justify-content:space-between !important;align-items:center !important;width:100% !important;padding:10px 12px !important;background:#1e272e !important;color:#ecf0f1 !important;border:1px solid #34495e !important;border-radius:8px !important;font:13px Arial !important;';
        const left = document.createElement('span');
        left.style.cssText = 'cursor:pointer !important;flex:1 !important;';
        left.textContent = (room.official ? '★ ' : '') + room.code + '  s' + room.subject + '/l' + room.lang;
        left.addEventListener('click', () => go(room.code));
        const right = document.createElement('span');
        right.style.cssText = 'color:#5dade2 !important;font-weight:bold !important;margin:0 8px !important;';
        right.textContent = room.quant + '/' + room.max;
        const pb = document.createElement('button');
        pb.textContent = 'Players';
        pb.style.cssText = 'padding:6px 10px !important;border:1px solid #34495e !important;background:#0f1419 !important;color:#fff !important;border-radius:6px !important;font:bold 11px Arial !important;cursor:pointer !important;';
        const sub = document.createElement('div');
        sub.style.cssText = 'display:none !important;flex-wrap:wrap !important;gap:5px !important;padding:8px 4px 2px 16px !important;';
        let busy = false;
        pb.addEventListener('click', () => {
            if (sub.style.display !== 'none') { sub.style.display = 'none'; return; }
            sub.style.display = 'flex';
            if (sub.dataset.done === '1' || busy) return;
            busy = true;
            sub.innerHTML = '';
            const ld = document.createElement('span');
            ld.style.cssText = 'color:#7f8c8d !important;font:12px Arial !important;';
            ld.textContent = 'connecting…';
            sub.appendChild(ld);
            fetchPlayers(room, (players, err) => {
                busy = false;
                sub.innerHTML = '';
                if (!players) {
                    ld.textContent = 'failed: ' + (err || 'unknown');
                    sub.appendChild(ld);
                    return;
                }
                sub.dataset.done = '1';
                players.forEach(p => {
                    const c = document.createElement('span');
                    c.style.cssText = 'padding:4px 9px !important;background:#1e272e !important;color:#ecf0f1 !important;border:1px solid #34495e !important;border-radius:12px !important;font:12px Arial !important;cursor:pointer !important;';
                    c.textContent = (p.nick || ('#' + p.id)) + (p.pontos != null ? ' ' + p.pontos : '');
                    c.addEventListener('click', () => go(room.code));
                    sub.appendChild(c);
                });
            });
        });
        b.appendChild(left);
        b.appendChild(right);
        b.appendChild(pb);
        wrap.appendChild(b);
        wrap.appendChild(sub);
        return wrap;
    }
    function render() {
        if (!listEl) return;
        if (statusEl) statusEl.textContent = 'updating…';
        fetchRooms(list => {
            renderHist();
            if (!listEl) return;
            listEl.innerHTML = '';
            if (!Array.isArray(list) || !list.length) {
                if (statusEl) statusEl.textContent = 'list unreachable';
                return;
            }
            const rooms = list.filter(r => r && r.code).sort((a, b) => (b.quant || 0) - (a.quant || 0));
            rooms.forEach(r => listEl.appendChild(row(r)));
            if (statusEl) statusEl.textContent = rooms.length + ' rooms live';
        });
    }
    function renderHist() {
        if (!histEl) return;
        histEl.innerHTML = '';
        getHist().forEach(code => {
            const b = document.createElement('button');
            b.style.cssText = 'padding:6px 12px !important;background:#1e272e !important;color:#5dade2 !important;border:1px solid #34495e !important;border-radius:14px !important;font:bold 12px Arial !important;cursor:pointer !important;';
            b.textContent = code;
            b.addEventListener('click', () => go(code));
            histEl.appendChild(b);
        });
    }
    function buildUI() {
        if (overlay || !document.body) return;
        overlay = document.createElement('div');
        overlay.id = 'room-scout';
        overlay.style.cssText = 'position:fixed !important;inset:0 !important;z-index:2147483646 !important;background:rgba(10,14,18,.96) !important;display:flex !important;align-items:center !important;justify-content:center !important;font-family:Arial,sans-serif !important;';
        const card = document.createElement('div');
        card.style.cssText = 'width:560px !important;max-width:94vw !important;max-height:88vh !important;overflow:auto !important;background:#0f1419 !important;border:1px solid #34495e !important;border-radius:14px !important;padding:20px !important;display:flex !important;flex-direction:column !important;gap:12px !important;';
        const head = document.createElement('div');
        head.style.cssText = 'color:#fff !important;font:700 16px Arial !important;display:flex !important;justify-content:space-between !important;align-items:center !important;';
        const title = document.createElement('span');
        title.textContent = 'Live rooms — click to watch';
        const x = document.createElement('span');
        x.textContent = '×';
        x.style.cssText = 'cursor:pointer !important;font-size:22px !important;';
        x.addEventListener('click', () => { stop(); overlay.remove(); });
        head.appendChild(title);
        head.appendChild(x);
        statusEl = document.createElement('div');
        statusEl.style.cssText = 'color:#7f8c8d !important;font:12px Arial !important;';
        statusEl.textContent = '…';
        const histTitle = document.createElement('div');
        histTitle.style.cssText = 'color:#7f8c8d !important;font:700 12px Arial !important;';
        histTitle.textContent = 'Recent';
        histEl = document.createElement('div');
        histEl.style.cssText = 'display:flex !important;flex-wrap:wrap !important;gap:6px !important;';
        const filt = document.createElement('div');
        filt.style.cssText = 'display:flex !important;gap:8px !important;';
        const selStyle = 'flex:1 !important;padding:9px !important;border:1px solid #34495e !important;background:#1e272e !important;color:#fff !important;border-radius:8px !important;font:13px Arial !important;';
        langEl = document.createElement('select');
        langEl.style.cssText = selStyle;
        const la = document.createElement('option');
        la.value = '';
        la.textContent = 'All languages';
        langEl.appendChild(la);
        LANGMAP.langs.forEach(l => {
            const o = document.createElement('option');
            o.value = String(l.id);
            o.textContent = l.name;
            langEl.appendChild(o);
        });
        langEl.addEventListener('change', () => { selLang = langEl.value; fillSubjects(); render(); });
        subjEl = document.createElement('select');
        subjEl.style.cssText = selStyle;
        subjEl.addEventListener('change', () => { selSubj = subjEl.value; render(); });
        filt.appendChild(langEl);
        filt.appendChild(subjEl);
        listEl = document.createElement('div');
        listEl.style.cssText = 'display:flex !important;flex-direction:column !important;gap:8px !important;';
        const bar = document.createElement('div');
        bar.style.cssText = 'display:flex !important;gap:8px !important;';
        const inp = document.createElement('input');
        inp.placeholder = 'room code (e.g. 38a2N)';
        inp.style.cssText = 'flex:1 !important;padding:10px !important;border:1px solid #34495e !important;background:#1e272e !important;color:#fff !important;border-radius:8px !important;font:13px Arial !important;';
        const goBtn = document.createElement('button');
        goBtn.textContent = 'Watch';
        goBtn.style.cssText = 'padding:10px 16px !important;border:none !important;background:#27ae60 !important;color:#fff !important;border-radius:8px !important;font:bold 13px Arial !important;cursor:pointer !important;';
        goBtn.addEventListener('click', () => go(inp.value));
        bar.appendChild(inp);
        bar.appendChild(goBtn);
        card.appendChild(head);
        card.appendChild(statusEl);
        card.appendChild(filt);
        card.appendChild(histTitle);
        card.appendChild(histEl);
        card.appendChild(listEl);
        card.appendChild(bar);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        fillSubjects();
        render();
        timer = setInterval(render, REFRESH_MS);
    }
    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    // ============ ROSTER mode: on room/viewer pages, live player list ============
    let rosterEl = null;
    function bus() { return w.WsCore || null; }
    function paintRoster() {
        if (!rosterEl) return;
        let players = [];
        try {
            const b = bus();
            players = (b && b.getPlayers()) || [];
        } catch (e) {}
        rosterEl.innerHTML = '';
        const title = document.createElement('div');
        title.style.cssText = 'color:#fff !important;font:700 13px Arial !important;margin-bottom:6px !important;';
        title.textContent = 'Players (' + players.length + ')';
        rosterEl.appendChild(title);
        players.forEach(p => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex !important;justify-content:space-between !important;color:#ecf0f1 !important;font:12px Arial !important;padding:3px 0 !important;border-bottom:1px solid #1e272e !important;';
            const nm = document.createElement('span');
            nm.textContent = p.nick || ('#' + p.id);
            const sc = document.createElement('span');
            sc.style.cssText = 'color:#5dade2 !important;';
            sc.textContent = String(p.pontos != null ? p.pontos : '');
            row.appendChild(nm);
            row.appendChild(sc);
            rosterEl.appendChild(row);
        });
    }
    function buildRoster() {
        if (rosterEl || !document.body) return;
        rosterEl = document.createElement('div');
        rosterEl.id = 'room-scout-roster';
        rosterEl.style.cssText = 'position:fixed !important;top:60px !important;right:10px !important;z-index:2147483646 !important;width:190px !important;max-height:60vh !important;overflow:auto !important;background:rgba(15,20,25,.92) !important;border:1px solid #34495e !important;border-radius:10px !important;padding:10px 12px !important;';
        document.body.appendChild(rosterEl);
        paintRoster();
        try {
            const b = bus();
            if (b) b.onRoster(() => paintRoster());
        } catch (e) {}
        setInterval(() => paintRoster(), 5000);
    }

    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
    }
    w.OmniStop_room_scout = function () {
        stop();
        try { if (overlay) overlay.remove(); } catch (e) {}
        try { if (rosterEl) rosterEl.remove(); } catch (e) {}
        try { delete w.__roomScout; } catch (e) {}
        overlay = null;
        rosterEl = null;
    };

    function boot() {
        if (roomCode && !browseMode) buildRoster();
        else buildUI();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else setTimeout(boot, 500);
    console.log('[room_scout] live list ready');
})();
