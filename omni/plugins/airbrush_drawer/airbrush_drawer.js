// airbrush_drawer — EXPERIMENTAL: thin contours + flood fill per color region.
// Flow: photo → grid → fewer colors → per region: 1px contour + flood seed.
// Runs on WsCore packet bus (dependency). Never touches raw WS.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('airbrush_drawer');
    if (!token || token.indexOf('airbrush_drawer') === -1) return;
    if (w.__airbrushDrawer) return;
    w.__airbrushDrawer = true;

    function bus() { return w.WsCore || null; }

    const GW = 48, GH = 28;
    const MAX_COLORS = 8;
    const GAP = 250;
    const MAX_PACKETS = 400;
    const CW = 770, CH = 450;
    const SX = CW / GW, SY = CH / GH;

    let regions = null;
    const queue = [];
    let timer = null;
    let panel = null, toggleBtn = null, previewEl = null, fileEl = null, statusEl = null;

    function sid() {
        const b = bus();
        if (!b) return null;
        try { return b.getSid(); } catch (e) { return null; }
    }
    function send(p) {
        const b = bus();
        if (!b) return false;
        try { return b.sendDraw(p); } catch (e) { return false; }
    }
    function hex(r, g, b) {
        const h = x => (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
        return h(r) + h(g) + h(b);
    }
    function processImage(img) {
        const cv = document.createElement('canvas');
        cv.width = GW; cv.height = GH;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, GW, GH);
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const sc = Math.min(GW / iw, GH / ih);
        const dw = Math.max(1, Math.round(iw * sc)), dh = Math.max(1, Math.round(ih * sc));
        ctx.drawImage(img, Math.round((GW - dw) / 2), Math.round((GH - dh) / 2), dw, dh);
        const d = ctx.getImageData(0, 0, GW, GH).data;
        const px = [];
        const freq = new Map();
        for (let i = 0; i < GW * GH; i++) {
            const r = d[i * 4] >> 4, g = d[i * 4 + 1] >> 4, b = d[i * 4 + 2] >> 4;
            const k = (r << 8) | (g << 4) | b;
            px.push(k);
            freq.set(k, (freq.get(k) || 0) + 1);
        }
        const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_COLORS).map(e => e[0]);
        const pal = top.map(k => [((k >> 8) & 15) * 17, ((k >> 4) & 15) * 17, (k & 15) * 17]);
        const grid = px.map(k => {
            let bi = 0, bd = Infinity;
            for (let j = 0; j < top.length; j++) {
                const dd = Math.abs(((k >> 8) & 15) - ((top[j] >> 8) & 15)) +
                    Math.abs(((k >> 4) & 15) - ((top[j] >> 4) & 15)) +
                    Math.abs((k & 15) - (top[j] & 15));
                if (dd < bd) { bd = dd; bi = j; }
            }
            return bi;
        });
        buildRegions(grid, pal);
        drawPreview(grid, pal);
        const pk = estimate();
        setStatus(GW + 'x' + GH + ', ' + pal.length + ' colors, ~' + pk + ' packets');
    }
    function buildRegions(grid, pal) {
        const seen = new Uint8Array(GW * GH);
        regions = [];
        const at = (x, y) => grid[y * GW + x];
        for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
            const i = y * GW + x;
            if (seen[i]) continue;
            const ci = grid[i];
            const hx = hex(pal[ci][0], pal[ci][1], pal[ci][2]);
            if (hx === 'FFFFFF') { seen[i] = 1; continue; }
            const comp = [];
            const stack = [[x, y]];
            seen[i] = 1;
            while (stack.length) {
                const cx = stack[0][0], cy = stack[0][1];
                stack.shift();
                comp.push([cx, cy]);
                const nb = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
                for (let k = 0; k < 4; k++) {
                    const nx = nb[k][0], ny = nb[k][1];
                    if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
                    const ni = ny * GW + nx;
                    if (!seen[ni] && grid[ni] === ci) { seen[ni] = 1; stack.push([nx, ny]); }
                }
            }
            const inset = new Set(comp.map(p => p[1] * GW + p[0]));
            const contour = [];
            let seed = null;
            comp.forEach(pt => {
                const px2 = pt[0], py2 = pt[1];
                const edge = px2 === 0 || py2 === 0 || px2 === GW - 1 || py2 === GH - 1 ||
                    !inset.has(py2 * GW + px2 + 1) || !inset.has(py2 * GW + px2 - 1) ||
                    !inset.has((py2 + 1) * GW + px2) || !inset.has((py2 - 1) * GW + px2);
                if (edge) contour.push(pt);
                else if (!seed) seed = pt;
            });
            regions.push({ hx: hx, contour: contour, seed: seed });
        }
    }
    function estimate() {
        if (!regions) return 0;
        let n = 1;
        const cols = new Set();
        regions.forEach(r => {
            if (!cols.has(r.hx)) { cols.add(r.hx); n++; }
            n += r.contour.length;
            if (r.seed) n++;
        });
        return n;
    }
    function drawPreview(grid, pal) {
        if (!previewEl) return;
        previewEl.width = GW; previewEl.height = GH;
        const ctx = previewEl.getContext('2d');
        for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
            const p = pal[grid[y * GW + x]];
            ctx.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
            ctx.fillRect(x, y, 1, 1);
        }
    }
    function orderStrokes(pts) {
        // Direction-coherent walk on GRID coords → long smooth strokes, then map to canvas.
        const left = pts.map(p => [p[0], p[1]]);
        const strokes = [];
        while (left.length) {
            const s = [left.shift()];
            let dx0 = 0, dy0 = 0;
            for (;;) {
                const last = s[s.length - 1];
                let bi = -1, bs = -Infinity;
                for (let i = 0; i < left.length; i++) {
                    const dx = left[i][0] - last[0], dy = left[i][1] - last[1];
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (dx === 0 && dy === 0)) continue;
                    let score = 10 - (Math.abs(dx) + Math.abs(dy));
                    if (s.length > 1) score += dx * dx0 + dy * dy0;
                    if (score > bs) { bs = score; bi = i; }
                }
                if (bi < 0) break;
                const nx = left[bi][0], ny = left[bi][1];
                dx0 = nx - last[0]; dy0 = ny - last[1];
                s.push(left[bi]);
                left.splice(bi, 1);
            }
            strokes.push(s.map(p => [Math.round((p[0] + 0.5) * SX), Math.round((p[1] + 0.5) * SY)]));
        }
        return strokes;
    }
    function pushStroke(pts) {
        // Max 16 pairs per packet; continuation repeats the last point.
        let i = 0;
        let first = true;
        while (i < pts.length) {
            if (queue.length > MAX_PACKETS) return;
            const pkt = [2];
            if (!first && i > 0) {
                pkt.push(pts[i - 1][0], pts[i - 1][1]);
            }
            first = false;
            let n = pkt.length > 1 ? 15 : 16;
            while (n > 0 && i < pts.length) {
                pkt.push(pts[i][0], pts[i][1]);
                i++;
                n--;
            }
            if (pkt.length === 3) queue.push([2, pkt[1], pkt[2], pkt[1] + 1, pkt[2] + 1]);
            else if (pkt.length > 1) queue.push(pkt);
            else break;
        }
    }
    function start() {
        if (timer || !regions || sid() == null) { setStatus(sid() == null ? 'mywsid: waiting…' : (!regions ? 'pick a photo first' : 'busy')); return; }
        queue.length = 0;
        queue.push([27, '1']);
        // Layers, biggest first: background with a wide brush, details sharp on top.
        const byColor = new Map();
        regions.forEach(r => {
            if (!byColor.has(r.hx)) byColor.set(r.hx, { cells: 0, list: [] });
            const e = byColor.get(r.hx);
            e.cells += r.contour.length + (r.seed ? 1 : 0);
            e.list.push(r);
        });
        const layers = [...byColor.entries()].sort((a, b) => b[1].cells - a[1].cells);
        function layerSize(cells) {
            return Math.max(2, Math.min(12, Math.round(Math.sqrt(cells) / 6)));
        }
        // Phase 1: ALL contours per layer. Phase 2: ALL floods per layer.
        layers.forEach(entry => {
            const hx = entry[0], e = entry[1];
            if (queue.length > MAX_PACKETS) return;
            queue.push([6, String(layerSize(e.cells))]);
            queue.push([5, 'x' + hx]);
            e.list.forEach(r => {
                orderStrokes(r.contour).forEach(s => {
                    if (s.length > 2) s.push(s[0].slice());
                    pushStroke(s);
                });
            });
        });
        let lastHx = null;
        layers.forEach(entry => {
            const hx = entry[0], e = entry[1];
            e.list.forEach(r => {
                if (!r.seed || queue.length > MAX_PACKETS) return;
                if (hx !== lastHx) { queue.push([5, 'x' + hx]); lastHx = hx; }
                queue.push([7, Math.round((r.seed[0] + 0.5) * SX), Math.round((r.seed[1] + 0.5) * SY)]);
            });
        });
        let i = 0;
        setStatus('drawing 0/' + queue.length);
        timer = setInterval(() => {
            if (i >= queue.length) { stop(); setStatus('done: ' + queue.length + ' packets'); return; }
            if (!send(queue[i])) { stop(); setStatus('send failed'); return; }
            i++;
            setStatus('drawing ' + i + '/' + queue.length);
        }, GAP);
    }
    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
    }
    function clearAll() {
        stop();
        setStatus(send([4]) ? 'canvas cleared' : 'mywsid: waiting…');
    }
    function setStatus(m) { if (statusEl) statusEl.textContent = m; }

    function buildUI() {
        if (panel || !document.body) return;
        const st = document.createElement('style');
        st.textContent = '#ab-toggle{position:fixed;left:10px;top:52px;z-index:2147483647;padding:10px 16px;background:#8e44ad;color:#fff;border:2px solid #fff;border-radius:20px;font:bold 13px Arial;cursor:pointer}#ab-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#1e272e;border:2px solid #fff;border-radius:12px;padding:14px;display:none;flex-direction:column;gap:10px;align-items:center}#ab-preview{width:192px;height:112px;background:#fff;border:1px solid #555;image-rendering:pixelated}#ab-filebtn{display:block;text-align:center;padding:9px 14px;background:#2c3e50;color:#ecf0f1;border:1px solid #fff;border-radius:8px;font:bold 12px Arial;cursor:pointer}#ab-file{display:none}.ab-row{display:flex;gap:8px;width:100%}.ab-row button{flex:1;padding:9px 0;border:none;border-radius:8px;color:#fff;font:bold 12px Arial;cursor:pointer}#ab-start{background:#8e44ad}#ab-clear{background:#7f8c8d}#ab-status{font:12px Arial;color:#b2bec3;text-align:center;min-height:15px;max-width:220px}';
        document.head.appendChild(st);
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'ab-toggle';
        toggleBtn.textContent = 'Airbrush (exp)';
        toggleBtn.addEventListener('click', () => {
            const open = panel.style.display === 'flex';
            panel.style.display = open ? 'none' : 'flex';
            toggleBtn.style.display = open ? 'block' : 'none';
        });
        panel = document.createElement('div');
        panel.id = 'ab-panel';
        previewEl = document.createElement('canvas');
        previewEl.id = 'ab-preview';
        previewEl.width = GW; previewEl.height = GH;
        fileEl = document.createElement('input');
        fileEl.id = 'ab-file';
        fileEl.type = 'file';
        fileEl.accept = 'image/*';
        fileEl.addEventListener('change', () => {
            const f = fileEl.files && fileEl.files[0];
            if (!f) return;
            const url = URL.createObjectURL(f);
            const im = new Image();
            im.onload = () => { URL.revokeObjectURL(url); processImage(im); };
            im.onerror = () => { URL.revokeObjectURL(url); setStatus('load failed'); };
            im.src = url;
            fileEl.value = '';
        });
        const fileBtn = document.createElement('label');
        fileBtn.id = 'ab-filebtn';
        fileBtn.textContent = 'Pick photo';
        fileBtn.appendChild(fileEl);
        const row = document.createElement('div');
        row.className = 'ab-row';
        const startBtn = document.createElement('button');
        startBtn.id = 'ab-start';
        startBtn.textContent = 'Start';
        startBtn.addEventListener('click', start);
        const clearBtn = document.createElement('button');
        clearBtn.id = 'ab-clear';
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', clearAll);
        row.appendChild(startBtn);
        row.appendChild(clearBtn);
        statusEl = document.createElement('div');
        statusEl.id = 'ab-status';
        statusEl.textContent = 'experimental — pick a photo';
        const close = document.createElement('button');
        close.textContent = '×';
        close.style.cssText = 'position:absolute;top:4px;right:10px;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;';
        close.addEventListener('click', () => { panel.style.display = 'none'; toggleBtn.style.display = 'block'; });
        panel.style.position = 'fixed';
        panel.appendChild(close);
        panel.appendChild(previewEl);
        panel.appendChild(fileBtn);
        panel.appendChild(row);
        panel.appendChild(statusEl);
        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);
    }

    w.OmniStop_airbrush_drawer = function () {
        stop();
        try { if (toggleBtn) toggleBtn.remove(); } catch (e) {}
        try { if (panel) panel.remove(); } catch (e) {}
        try { delete w.__airbrushDrawer; } catch (e) {}
        panel = null; toggleBtn = null;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
    else setTimeout(buildUI, 300);
    console.log('[airbrush_drawer] experimental ready');
})();
