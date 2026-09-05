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

    const path = (location.pathname || '').toLowerCase();
    if (path.indexOf('whowhere') < 0 && path.indexOf('rooms') < 0) return;
    w.__roomScout = true;

    const LIST_URL = 'https://gartic.io/req/list';
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
    function row(room) {
        const b = document.createElement('button');
        b.style.cssText = 'display:flex !important;justify-content:space-between !important;align-items:center !important;width:100% !important;padding:10px 12px !important;background:#1e272e !important;color:#ecf0f1 !important;border:1px solid #34495e !important;border-radius:8px !important;font:13px Arial !important;cursor:pointer !important;';
        const left = document.createElement('span');
        left.textContent = (room.official ? '★ ' : '') + room.code + '  s' + room.subject + '/l' + room.lang;
        const right = document.createElement('span');
        right.style.cssText = 'color:#5dade2 !important;font-weight:bold !important;';
        right.textContent = room.quant + '/' + room.max;
        b.appendChild(left);
        b.appendChild(right);
        b.addEventListener('click', () => go(room.code));
        return b;
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

    w.OmniStop_room_scout = function () {
        stop();
        try { if (overlay) overlay.remove(); } catch (e) {}
        try { delete w.__roomScout; } catch (e) {}
        overlay = null;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
    else setTimeout(buildUI, 500);
    console.log('[room_scout] live list ready');
})();
