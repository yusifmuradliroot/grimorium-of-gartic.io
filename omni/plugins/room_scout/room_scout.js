// room_scout — fullscreen room browser. Active only on whowhere-like pages.
// Lists detected rooms with players, click → /<code>/viewer. Manual code fallback.
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

    const RESERVED = { rooms: 1, create: 1, join: 1, viewer: 1, play: 1, theme: 1, apps: 1, list: 1, options: 1, privacy: 1, discord: 1, download: 1, gartic: 1, itunes: 1, instagram: 1, logout: 1, details: 1, service: 1, req: 1, id: 1, images: 1, app: 1 };
    const HIST_KEY = 'room_scout_history';
    let overlay = null, listEl = null, histEl = null;

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

    function findRooms() {
        const found = new Map();
        const links = document.querySelectorAll('a[href]');
        for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute('href') || '';
            const m = href.match(/^\/([A-Za-z0-9]{3,8})\/?$/);
            if (!m || RESERVED[m[1].toLowerCase()]) continue;
            const code = m[1];
            if (!found.has(code)) {
                const host = links[i].closest('div,li,tr,section') || links[i];
                const txt = (host.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
                found.set(code, txt);
            }
        }
        return [...found.entries()].map(e => ({ code: e[0], info: e[1] }));
    }
    function go(code) {
        code = (code || '').trim().replace(/^\//, '').replace(/\/viewer\/?$/, '');
        if (!/^[A-Za-z0-9]{3,8}$/.test(code)) return;
        saveHist(code);
        location.href = '/' + code + '/viewer';
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
        if (!getHist().length) {
            const d = document.createElement('div');
            d.style.cssText = 'color:#7f8c8d !important;font:12px Arial !important;';
            d.textContent = 'No recent rooms yet.';
            histEl.appendChild(d);
        }
    }
    function render() {
        renderHist();
        if (!listEl) return;
        listEl.innerHTML = '';
        const rooms = findRooms();
        if (!rooms.length) {
            const d = document.createElement('div');
            d.style.cssText = 'color:#7f8c8d !important;font:13px Arial !important;';
            d.textContent = 'No rooms detected — type a code below.';
            listEl.appendChild(d);
            return;
        }
        rooms.forEach(r => {
            const row = document.createElement('button');
            row.style.cssText = 'display:block !important;width:100% !important;text-align:left !important;padding:10px 12px !important;background:#1e272e !important;color:#ecf0f1 !important;border:1px solid #34495e !important;border-radius:8px !important;font:13px Arial !important;cursor:pointer !important;';
            row.textContent = r.code + (r.info ? ' — ' + r.info : '');
            row.addEventListener('click', () => go(r.code));
            listEl.appendChild(row);
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
        title.textContent = 'Rooms — click to watch';
        const x = document.createElement('span');
        x.textContent = '×';
        x.style.cssText = 'cursor:pointer !important;font-size:22px !important;';
        x.addEventListener('click', () => overlay.remove());
        head.appendChild(title);
        head.appendChild(x);
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
        const reBtn = document.createElement('button');
        reBtn.textContent = 'Refresh';
        reBtn.style.cssText = 'padding:10px 16px !important;border:1px solid #34495e !important;background:#1e272e !important;color:#fff !important;border-radius:8px !important;font:bold 13px Arial !important;cursor:pointer !important;';
        reBtn.addEventListener('click', render);
        bar.appendChild(inp);
        bar.appendChild(goBtn);
        bar.appendChild(reBtn);
        card.appendChild(head);
        card.appendChild(histTitle);
        card.appendChild(histEl);
        card.appendChild(listEl);
        card.appendChild(bar);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        render();
    }

    w.OmniStop_room_scout = function () {
        try { if (overlay) overlay.remove(); } catch (e) {}
        try { delete w.__roomScout; } catch (e) {}
        overlay = null;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
    else setTimeout(buildUI, 500);
    console.log('[room_scout] ready');
})();
