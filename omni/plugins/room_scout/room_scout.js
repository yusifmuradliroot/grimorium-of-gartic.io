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
    function fetchRooms(cb) {
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: LIST_URL + '?_=' + Date.now(), timeout: 10000,
                    onload: r => {
                        try { cb(JSON.parse(r.responseText)); } catch (e) { cb(null); }
                    },
                    onerror: () => cb(null), ontimeout: () => cb(null) });
            } else {
                fetch(LIST_URL + '?_=' + Date.now(), { cache: 'no-store' }).then(r => r.json()).then(cb).catch(() => cb(null));
            }
        } catch (e) { cb(null); }
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
        card.appendChild(histTitle);
        card.appendChild(histEl);
        card.appendChild(listEl);
        card.appendChild(bar);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
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
