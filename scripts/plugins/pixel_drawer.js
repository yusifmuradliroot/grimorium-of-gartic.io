// pixel_drawer — nerfed, Orbit API üzerinden, Voyager→Orbit→VM ile çalışır
// Recode 0'dan, abyss mantığı gibi ama nerf: max 32, 250ms, burst 8, no auto-start, no flood
// Çalınma koruması: w.Orbit.verify('pixel_drawer') yoksa abort, standalone çalışmaz

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ——— Orbit verify ———
    // orbitCore + w.Orbit.verify yoksa Omni dışında çalışıyor → abort
    if (!w.__orbitCore || !w.Orbit || typeof w.Orbit.verify !== 'function') {
        console.warn('[pixel_drawer] Orbit verify yok — Omni dışında abort');
        return;
    }
    const token = w.Orbit.verify('pixel_drawer');
    if (!token || token.indexOf('pixel_drawer') === -1) {
        console.warn('[pixel_drawer] verify fail → abort');
        return;
    }
    // verify OK — Orbit API üzerinden devam
    const Orbit = w.Orbit;

    if (w.__pixelDrawer) return;
    w.__pixelDrawer = true;

    // ——— Nerfed Effort (lean'den zayıf) ———
    const EFF_CFG = { CANDIDATES: [32, 24, 16], SNAP_BITS: 3, SRC_MAX: 512, GRACE_S: 5 };
    function rgbToHex(c) { return ((1 << 24) | (c[0] << 16) | (c[1] << 8) | c[2]).toString(16).slice(1).toUpperCase(); }
    function computeLayout(gw, gh, W, H) { const s = Math.min(W / gw, H / gh); return { s, offX: Math.round((W - gw * s) / 2), offY: Math.round((H - gh * s) / 2) }; }
    function dimsFor(ls, iw, ih) { return iw >= ih ? { gw: ls, gh: Math.max(2, Math.round(ls * ih / iw)) } : { gh: ls, gw: Math.max(2, Math.round(ls * iw / ih)) }; }
    function prepareSource(img) {
        const iw = Math.max(1, img.naturalWidth || img.width), ih = Math.max(1, img.naturalHeight || img.height);
        const sc = Math.min(1, EFF_CFG.SRC_MAX / Math.max(iw, ih));
        const minSide = EFF_CFG.CANDIDATES[EFF_CFG.CANDIDATES.length - 1];
        const fw = Math.max(minSide, Math.round(iw * sc)), fh = Math.max(minSide, Math.round(ih * sc));
        const cv = document.createElement('canvas'); cv.width = fw; cv.height = fh;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, fw, fh);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, fw, fh);
        const sd = ctx.getImageData(0, 0, fw, fh); const sq = sd.data; const SH = 8 - EFF_CFG.SNAP_BITS, LVL = (1 << EFF_CFG.SNAP_BITS) - 1;
        for (let i = 0; i < sq.length; i += 4) { sq[i] = Math.round((sq[i] >> SH) * 255 / LVL); sq[i + 1] = Math.round((sq[i + 1] >> SH) * 255 / LVL); sq[i + 2] = Math.round((sq[i + 2] >> SH) * 255 / LVL); }
        return { sd, fw, fh, iw, ih };
    }
    function sampleGrid(sd, fw, fh, gw, gh) {
        const out = new Array(gw * gh);
        for (let gy = 0; gy < gh; gy++) {
            const y0 = Math.floor(gy * fh / gh), y1 = Math.max(y0 + 1, Math.floor((gy + 1) * fh / gh));
            for (let gx = 0; gx < gw; gx++) {
                const x0 = Math.floor(gx * fw / gw), x1 = Math.max(x0 + 1, Math.floor((gx + 1) * fw / gw));
                const counts = new Map();
                for (let yy = y0; yy < y1; yy++) { const ro = yy * fw; for (let xx = x0; xx < x1; xx++) { const o = (ro + xx) * 4; const k = (sd.data[o] << 16) | (sd.data[o + 1] << 8) | sd.data[o + 2]; counts.set(k, (counts.get(k) || 0) + 1); } }
                let bk = -1, bn = -1; counts.forEach((n, k) => { if (n > bn) { bn = n; bk = k; } });
                out[gy * gw + gx] = [(bk >> 16) & 255, (bk >> 8) & 255, bk & 255];
            }
        }
        return out;
    }
    function extractRects(idxGrid, gw, gh) {
        const used = new Uint8Array(gw * gh), rects = []; const key = (x, y) => y * gw + x;
        for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
            const i = key(x, y); if (used[i]) continue; const ci = idxGrid[i]; if (ci < 0) continue;
            let wd = 1; while (x + wd < gw && idxGrid[key(x + wd, y)] === ci && !used[key(x + wd, y)]) wd++;
            let ht = 1; grow: while (y + ht < gh) { for (let k = 0; k < wd; k++) { const j = key(x + k, y + ht); if (idxGrid[j] !== ci || used[j]) break grow; } ht++; }
            for (let dy = 0; dy < ht; dy++) for (let dx = 0; dx < wd; dx++) used[key(x + dx, y + dy)] = 1;
            rects.push({ ci, x, y, w: wd, h: ht });
        }
        return rects;
    }
    function planCandidate(g, buf) {
        const dd = dimsFor(g, buf.iw, buf.ih); const gw = dd.gw, gh = dd.gh;
        const grid = sampleGrid(buf.sd, buf.fw, buf.fh, gw, gh);
        const palMap = new Map(), palRgb = [], idxGrid = new Array(gw * gh);
        for (let i = 0; i < gw * gh; i++) {
            const p = grid[i]; const k = (p[0] << 16) | (p[1] << 8) | p[2];
            let idx = palMap.get(k); if (idx === undefined) { idx = palRgb.length; palMap.set(k, idx); palRgb.push(p.slice()); }
            idxGrid[i] = idx;
        }
        const rects = extractRects(idxGrid, gw, gh);
        const byHex = new Map();
        rects.forEach(r => {
            const hx = rgbToHex(palRgb[r.ci]);
            if (hx === 'FFFFFF') return;
            if (!byHex.has(hx)) byHex.set(hx, { hex: hx, list: [] });
            byHex.get(hx).list.push(r);
        });
        const groups = [...byHex.values()];
        return { gw, gh, groups, colors: groups.length, rectCount: rects.filter(r => rgbToHex(palRgb[r.ci]) !== 'FFFFFF').length };
    }
    function planFromImage(img, opts) {
        opts = opts || {}; const T = Object.assign({ packetMs: 250, burst: 8, burstPauseMs: 600 }, opts.timing || {});
        const maxDrawS = Math.max(10, opts.maxDrawS || 60); const limitSec = maxDrawS * 0.9 + EFF_CFG.GRACE_S;
        const buf = prepareSource(img);
        function est(n) { if (n <= 1) return 0; const g = n - 1; return (g * T.packetMs + Math.floor(g / Math.max(1, T.burst)) * T.burstPauseMs) / 1000; }
        let chosen = null; const candParts = [];
        for (const g of EFF_CFG.CANDIDATES) {
            const cand = planCandidate(g, buf);
            const totalPk = 1 + cand.groups.length + cand.rectCount;
            const e = est(totalPk);
            candParts.push(cand.gw + 'x' + cand.gh + ':' + cand.rectCount + 'p/' + e.toFixed(0) + 'sn');
            if (!chosen && e <= limitSec) chosen = cand;
        }
        let forced = false; if (!chosen) { const g = EFF_CFG.CANDIDATES[EFF_CFG.CANDIDATES.length - 1]; chosen = planCandidate(g, buf); forced = true; }
        const L = computeLayout(chosen.gw, chosen.gh, 770, 450); const mx = i => Math.round(L.offX + i * L.s), my = i => Math.round(L.offY + i * L.s);
        const packets = [{ p: [27, '1'] }];
        chosen.groups.forEach(ent => { packets.push({ p: [5, 'x' + ent.hex] }); ent.list.forEach(r => packets.push({ p: [1, 2, mx(r.x), my(r.y), mx(r.x + r.w), my(r.y + r.h)] })); });
        const pv = document.createElement('canvas'); pv.width = chosen.gw; pv.height = chosen.gh;
        const pc = pv.getContext('2d'); pc.fillStyle = '#ffffff'; pc.fillRect(0, 0, pv.width, pv.height);
        chosen.groups.forEach(ent => { pc.fillStyle = '#' + ent.hex; ent.list.forEach(r => pc.fillRect(r.x, r.y, r.w, r.h)); });
        const idata = pc.getImageData(0, 0, pv.width, pv.height);
        const totalPk = packets.length; const dbg = 'adaylar[' + candParts.join(' ') + '] -> ' + chosen.gw + 'x' + chosen.gh + ' ~' + est(totalPk).toFixed(1) + 'sn' + (forced ? ' BUTCE ASILDI' : '');
        return { ok: true, gw: chosen.gw, gh: chosen.gh, packets, meta: { colors: chosen.colors, rectPackets: chosen.rectCount, estSeconds: est(totalPk), limitSeconds: limitSec, forcedSmall: forced, candText: candParts.join(' '), debug: dbg, preview: idata } };
    }
    w.PixelDrawerEffort = { version: '1.0-nerf', planFromImage: (img, opts) => { try { return planFromImage(img, opts); } catch (e) { return { ok: false, error: String(e) }; } } };

    // ——— pixel_drawer bot (nerf, Orbit API) ———
    const CFG = { PACKET_MS: 250, BURST: 8, BURST_PAUSE_MS: 600, JITTER_MS: 2, MAX_DRAW_S: 60 };
    const state = { processed: false, gw: 0, gh: 0, queue: [], total: 0, idx: 0, drawing: false, timer: null, nextAt: 0, drawStart: 0, turnActive: false };
    let tickerWorker = null;
    let panel = null, toggleBtn = null, previewEl = null, fileEl = null, infoEl1 = null, infoEl2 = null, fillEl = null, startBtn = null, stopBtn = null, clearBtn = null, statusEl = null, isOpen = false;

    function init() {
        // Orbit events üzerinden — direkt w.addEventListener değil, w.Orbit.events
        Orbit.events.on('ws-session-open', () => { updateButtons(); setStatus(state.processed ? (state.turnActive ? 'Hazır (nerf)' : 'Sıra gelince bekle') : 'foto bekleniyor'); });
        Orbit.events.on('ws-session-close', () => { state.turnActive = false; if (state.drawing) halt('⚠ Oturum kapandı'); updateButtons(); });
        Orbit.events.on('api-draw-turn', handleDrawTurn);
        // late turn check via Orbit API
        setTimeout(() => { try { const t = Orbit.api.getDrawTurn(); if (t && t.active) { state.turnActive = true; updateButtons(); console.log('[pixel_drawer] late turn', t); } } catch (e) {} }, 1500);
        console.log('%c[pixel_drawer] v1.0-nerf aktif — Orbit API, max 32, 250ms, burst 8, manuel', 'color:#e67e22;font-weight:bold');
    }
    function handleDrawTurn(e) {
        const info = e && e.detail; if (!info) return;
        if (!info.active) { if (state.turnActive) { state.turnActive = false; updateButtons(); } return; }
        state.turnActive = true; updateButtons();
        // nerf: auto-start YOK, sadece status güncelle, kullanıcı manuel başlatır
        if (!info.words || !info.words.length) return;
        setStatus('Sıra bizde! Manuel ▶ Çiz (nerf)');
        console.log('[pixel_drawer] sıra bizde, words:', info.words.map(x => x.word).join(', '));
    }
    function ensureTicker() {
        if (tickerWorker || typeof Worker === 'undefined') return;
        const src = 'var id=null;onmessage=function(e){if(e.data==="start"){if(id)return;id=setInterval(function(){postMessage(1);},' + CFG.PACKET_MS + ');}else{if(id){clearInterval(id);id=null;}}};';
        try { tickerWorker = new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' }))); tickerWorker.onmessage = onTicker; } catch (e) { tickerWorker = null; }
    }
    function startTicker() { ensureTicker(); if (tickerWorker) tickerWorker.postMessage('start'); else scheduleNext(); }
    function stopTicker() { if (tickerWorker) tickerWorker.postMessage('stop'); if (state.timer) { clearTimeout(state.timer); state.timer = null; } }
    function scheduleNext() { state.timer = setTimeout(onTicker, Math.max(0, state.nextAt - Date.now())); }
    function startDrawing() {
        if (state.drawing || !state.processed) return;
        const sid = Orbit.api.getMyWsId(); if (sid == null) { setStatus('Oturum yok! Odada değilsin'); console.warn('[pixel_drawer] sid null'); return; }
        if (!state.turnActive) { setStatus('Sıra bizde değil — bekle'); return; }
        state.drawing = true; state.idx = 0; state.nextAt = Date.now(); state.drawStart = Date.now();
        updateButtons(); startTicker(); onTicker();
        console.log('%c[pixel_drawer] ▶ çizim başladı: ' + state.total + ' paket ~' + estSeconds(state.total).toFixed(1) + 'sn | ' + state.gw + 'x' + state.gh, 'color:#e67e22;font-weight:bold');
    }
    function onTicker() {
        if (!state.drawing) return; if (Date.now() < state.nextAt) return;
        if (Date.now() - state.drawStart > CFG.MAX_DRAW_S * 1000) { state.turnActive = false; updateButtons(); halt('⏱ Süre doldu (' + state.idx + '/' + state.total + ')'); return; }
        if (state.idx >= state.total) { halt('✓ Tamamlandı! ' + state.total + ' paket'); return; }
        const sid = Orbit.api.getMyWsId(); if (typeof Orbit.hub.sendWS !== 'function' || sid == null) { halt('⚠ Bağlantı yok'); return; }
        if (!Orbit.hub.sendWS('42["10",' + sid + ',' + JSON.stringify(state.queue[state.idx].p) + ']')) { halt('⚠ Gönderim hatası'); return; }
        state.idx++; updateProgress(); setStatus('Çiziliyor... ' + state.idx + '/' + state.total);
        const now = Date.now(); if (state.nextAt < now - CFG.PACKET_MS * 8) state.nextAt = now;
        let gap = CFG.PACKET_MS + (state.idx % CFG.BURST === 0 ? CFG.BURST_PAUSE_MS : 0);
        if (CFG.JITTER_MS > 0) { gap += Math.round((Math.random() * 2 - 1) * CFG.JITTER_MS); if (gap < 30) gap = 30; }
        state.nextAt += gap; if (!tickerWorker) scheduleNext();
    }
    function estSeconds(n) { if (n <= 1) return 0; const g = n - 1; return (g * CFG.PACKET_MS + Math.floor(g / CFG.BURST) * CFG.BURST_PAUSE_MS) / 1000; }
    function halt(msg) { stopTicker(); state.drawing = false; updateButtons(); setStatus(msg); }
    function clearCanvas() {
        if (!state.turnActive) { setStatus('Sıra bizde değil!'); return; }
        const sid = Orbit.api.getMyWsId(); if (typeof Orbit.hub.sendWS !== 'function' || sid == null) { setStatus('Oturum yok!'); return; }
        if (Orbit.hub.sendWS('42["10",' + sid + ',[4]]')) setStatus('Tuval temizlendi'); else setStatus('Gönderilemedi!');
    }
    function processImage(img) {
        const res = w.PixelDrawerEffort.planFromImage(img, { timing: { packetMs: CFG.PACKET_MS, burst: CFG.BURST, burstPauseMs: CFG.BURST_PAUSE_MS }, maxDrawS: CFG.MAX_DRAW_S });
        if (!res || !res.ok) throw new Error((res && res.error) || 'plan hatası');
        state.gw = res.gw; state.gh = res.gh; state.queue = res.packets.slice(); state.total = state.queue.length; state.idx = 0; state.processed = true; return res;
    }
    // ——— GUI (Orbit GUI'sinden ayrı, kendi paneli) ———
    function ensureUI() {
        if (panel || !document.body) return;
        const s = document.createElement('style');
        s.textContent = '#pd-toggle{position:fixed;left:14px;top:60px;z-index:2147483646;padding:8px 16px;background:#e67e22;color:#fff;border:none;border-radius:20px;font:bold 12px Arial;cursor:pointer}#pd-panel{position:fixed;top:60px;left:14px;z-index:2147483646;width:232px;background:#1e272e;border:1px solid #e67e22;border-radius:10px;overflow:hidden;display:none}#pd-head{display:flex;align-items:center;padding:8px 10px;background:#e67e22;font:bold 13px Arial;color:#fff}#pd-close{margin-left:auto;cursor:pointer}#pd-body{padding:10px;display:flex;flex-direction:column;gap:8px}#pd-preview{width:120px;height:120px;margin:0 auto;display:block;background:#141a1e;border:1px solid #34495e;border-radius:6px;image-rendering:pixelated}#pd-filebtn{display:block;text-align:center;padding:8px;background:#2c3e50;color:#ecf0f1;border:1px solid #e67e22;border-radius:6px;font:bold 12px Arial;cursor:pointer}#pd-file{display:none}.pd-info{font:11px Arial;color:#95a5a6;text-align:center}.pd-bar{height:8px;background:#141a1e;border:1px solid #34495e;border-radius:4px;overflow:hidden}#pd-fill{height:100%;width:0%;background:#e67e22}.pd-row{display:flex;gap:6px}.pd-row button{flex:1;padding:7px 0;border:none;border-radius:6px;color:#fff;font:bold 11px Arial;cursor:pointer}.pd-row button:disabled{opacity:.35}#pd-start{background:#e67e22}#pd-stop{background:#c0392b}#pd-clear{background:#7f8c8d}.pd-check{display:none}#pd-status{font:11px Arial;color:#b2bec3;text-align:center;min-height:14px}';
        document.head.appendChild(s);
        panel = document.createElement('div'); panel.id = 'pd-panel';
        const head = document.createElement('div'); head.id = 'pd-head'; head.textContent = 'PIXEL_DRAWER (NERF)'; const close = document.createElement('span'); close.id = 'pd-close'; close.textContent = '×'; close.onclick = () => show(false); head.appendChild(close);
        const body = document.createElement('div'); body.id = 'pd-body';
        previewEl = document.createElement('canvas'); previewEl.id = 'pd-preview'; previewEl.width = 32; previewEl.height = 32;
        fileEl = document.createElement('input'); fileEl.id = 'pd-file'; fileEl.type = 'file'; fileEl.accept = 'image/*';
        const fileBtn = document.createElement('label'); fileBtn.id = 'pd-filebtn'; fileBtn.textContent = '🖼 Fotoğraf Seç'; fileBtn.appendChild(fileEl); fileEl.onchange = handleFile;
        infoEl1 = document.createElement('div'); infoEl1.className = 'pd-info'; infoEl1.textContent = 'foto bekleniyor (max 32)';
        infoEl2 = document.createElement('div'); infoEl2.className = 'pd-info'; infoEl2.innerHTML = '&nbsp;';
        const bar = document.createElement('div'); bar.className = 'pd-bar'; fillEl = document.createElement('div'); fillEl.id = 'pd-fill'; bar.appendChild(fillEl);
        startBtn = document.createElement('button'); startBtn.id = 'pd-start'; startBtn.textContent = '▶ Çiz (nerf)'; startBtn.onclick = startDrawing;
        stopBtn = document.createElement('button'); stopBtn.id = 'pd-stop'; stopBtn.textContent = 'Durdur'; stopBtn.onclick = () => halt('Durduruldu');
        clearBtn = document.createElement('button'); clearBtn.id = 'pd-clear'; clearBtn.textContent = 'Sil'; clearBtn.onclick = clearCanvas;
        const row = document.createElement('div'); row.className = 'pd-row'; row.appendChild(startBtn); row.appendChild(stopBtn); row.appendChild(clearBtn);
        statusEl = document.createElement('div'); statusEl.id = 'pd-status'; statusEl.textContent = 'Sıra sende iken manuel başlat (nerf)';
        body.appendChild(previewEl); body.appendChild(fileBtn); body.appendChild(infoEl1); body.appendChild(infoEl2); body.appendChild(bar); body.appendChild(row); body.appendChild(statusEl);
        panel.appendChild(head); panel.appendChild(body);
        toggleBtn = document.createElement('button'); toggleBtn.id = 'pd-toggle'; toggleBtn.textContent = 'Pixel Drawer [P]'; toggleBtn.onclick = () => show(!isOpen);
        document.body.appendChild(panel); document.body.appendChild(toggleBtn);
        document.addEventListener('keydown', e => { if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.altKey && !e.metaKey) { const t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return; show(!isOpen); } });
        updateButtons();
    }
    function show(o) { if (!panel) return; isOpen = !!o; panel.style.display = isOpen ? 'block' : 'none'; toggleBtn.style.display = isOpen ? 'none' : 'block'; }
    function setStatus(m) { if (statusEl) statusEl.textContent = m; }
    function updateButtons() { if (!startBtn) return; startBtn.disabled = !state.processed || state.drawing || !state.turnActive; stopBtn.disabled = !state.drawing; clearBtn.disabled = !state.turnActive; }
    function updateProgress() { if (fillEl) fillEl.style.width = state.total ? (state.idx / state.total * 100) + '%' : '0%'; }
    function handleFile() {
        const f = fileEl.files && fileEl.files[0]; if (!f) return;
        const url = URL.createObjectURL(f); const im = new Image();
        im.onload = () => { URL.revokeObjectURL(url); applyImage(im); };
        im.onerror = () => { URL.revokeObjectURL(url); setStatus('Yüklenemedi'); }; im.src = url; fileEl.value = '';
    }
    function applyImage(img) {
        if (state.drawing) halt('Yeni foto');
        let res; try { res = processImage(img); } catch (e) { setStatus('Hata:' + e.message); return; }
        previewEl.width = res.gw; previewEl.height = res.gh; previewEl.getContext('2d').putImageData(res.meta.preview, 0, 0);
        const sc = Math.min(120 / res.gw, 120 / res.gh); previewEl.style.width = Math.round(res.gw * sc) + 'px'; previewEl.style.height = Math.round(res.gh * sc) + 'px';
        infoEl1.textContent = res.gw + '×' + res.gh + ' • ' + res.meta.colors + ' renk • ' + res.meta.rectPackets + ' rect (nerf)';
        infoEl2.textContent = state.total + ' paket ~' + estSeconds(state.total).toFixed(1) + 'sn (nerf)';
        updateProgress(); updateButtons(); setStatus(state.turnActive ? 'Hazır — manuel başlat' : 'Hazır — sıra gelince manuel');
    }
    w.pixelDrawerStop = () => { if (state.drawing) halt('Durduruldu'); };
    w.pixelDrawerState = () => ({ drawing: state.drawing, sent: state.idx, total: state.total });
    (function boot() { const start = () => { ensureUI(); show(false); init(); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start(); })();
})();
