// pixel_drawer — photo to 8x8, 2-2-2 bit color, 1 packet per 250ms, minimal UI.
// Runs on WsCore packet bus (dependency). Never touches raw WS.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('pixel_drawer');
    if (!token || token.indexOf('pixel_drawer') === -1) return;
    if (w.__pixelDrawer) return;
    w.__pixelDrawer = true;

    function bus() { return w.WsCore || null; }

    const N = 8;
    const GAP = 250;
    let grid = null;
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
    function q2(v) {
        const q = Math.round(v / 255 * 3);
        return Math.round(q / 3 * 255);
    }
    function hex(r, g, b) {
        const h = x => (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
        return h(r) + h(g) + h(b);
    }
    function processImage(img) {
        const cv = document.createElement('canvas');
        cv.width = N; cv.height = N;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, N, N);
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const sc = Math.min(N / iw, N / ih);
        const dw = Math.max(1, Math.round(iw * sc)), dh = Math.max(1, Math.round(ih * sc));
        ctx.drawImage(img, Math.round((N - dw) / 2), Math.round((N - dh) / 2), dw, dh);
        const d = ctx.getImageData(0, 0, N, N).data;
        grid = [];
        for (let i = 0; i < N * N; i++) {
            grid.push([q2(d[i * 4]), q2(d[i * 4 + 1]), q2(d[i * 4 + 2])]);
        }
        drawPreview();
        const colors = new Set(grid.map(p => hex(p[0], p[1], p[2]))).size;
        setStatus(N + 'x' + N + ' ready, ' + colors + ' colors — Start to draw');
    }
    function drawPreview() {
        if (!previewEl || !grid) return;
        previewEl.width = N; previewEl.height = N;
        const ctx = previewEl.getContext('2d');
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            const p = grid[y * N + x];
            ctx.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
            ctx.fillRect(x, y, 1, 1);
        }
    }
    function layout() {
        const cw = 770, ch = 450;
        const s = Math.floor(Math.min(cw / N, ch / N));
        return { s: s, ox: Math.round((cw - N * s) / 2), oy: Math.round((ch - N * s) / 2) };
    }
    function start() {
        if (timer || !grid || sid() == null) { setStatus(sid() == null ? 'mywsid: waiting…' : (!grid ? 'pick a photo first' : 'busy')); return; }
        queue.length = 0;
        const L = layout();
        const byColor = new Map();
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            const p = grid[y * N + x];
            const hx = hex(p[0], p[1], p[2]);
            if (hx === 'FFFFFF') continue;
            if (!byColor.has(hx)) byColor.set(hx, []);
            byColor.get(hx).push([L.ox + x * L.s, L.oy + y * L.s, L.ox + (x + 1) * L.s, L.oy + (y + 1) * L.s]);
        }
        queue.push([27, '1']);
        byColor.forEach((rects, hx) => {
            queue.push([5, 'x' + hx]);
            rects.forEach(r => queue.push([1, 2, r[0], r[1], r[2], r[3]]));
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
        st.textContent = '#pd8-toggle{position:fixed;left:10px;top:8px;z-index:2147483647;padding:10px 16px;background:#222;color:#fff;border:2px solid #fff;border-radius:20px;font:bold 13px Arial;cursor:pointer}#pd8-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#1e272e;border:2px solid #fff;border-radius:12px;padding:14px;display:none;flex-direction:column;gap:10px;align-items:center}#pd8-preview{width:120px;height:120px;background:#fff;border:1px solid #555;image-rendering:pixelated}#pd8-filebtn{display:block;text-align:center;padding:9px 14px;background:#2c3e50;color:#ecf0f1;border:1px solid #fff;border-radius:8px;font:bold 12px Arial;cursor:pointer}#pd8-file{display:none}.pd8-row{display:flex;gap:8px;width:100%}.pd8-row button{flex:1;padding:9px 0;border:none;border-radius:8px;color:#fff;font:bold 12px Arial;cursor:pointer}#pd8-start{background:#27ae60}#pd8-clear{background:#7f8c8d}#pd8-status{font:12px Arial;color:#b2bec3;text-align:center;min-height:15px;max-width:200px}';
        document.head.appendChild(st);
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'pd8-toggle';
        toggleBtn.textContent = 'Pixel 8×8';
        toggleBtn.addEventListener('click', () => {
            const open = panel.style.display === 'flex';
            panel.style.display = open ? 'none' : 'flex';
            toggleBtn.style.display = open ? 'block' : 'none';
        });
        panel = document.createElement('div');
        panel.id = 'pd8-panel';
        previewEl = document.createElement('canvas');
        previewEl.id = 'pd8-preview';
        previewEl.width = N; previewEl.height = N;
        fileEl = document.createElement('input');
        fileEl.id = 'pd8-file';
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
        fileBtn.id = 'pd8-filebtn';
        fileBtn.textContent = 'Pick photo';
        fileBtn.appendChild(fileEl);
        const row = document.createElement('div');
        row.className = 'pd8-row';
        const startBtn = document.createElement('button');
        startBtn.id = 'pd8-start';
        startBtn.textContent = 'Start';
        startBtn.addEventListener('click', start);
        const clearBtn = document.createElement('button');
        clearBtn.id = 'pd8-clear';
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', clearAll);
        row.appendChild(startBtn);
        row.appendChild(clearBtn);
        statusEl = document.createElement('div');
        statusEl.id = 'pd8-status';
        statusEl.textContent = 'pick a photo first';
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

    w.OmniStop_pixel_drawer = function () {
        stop();
        try { if (toggleBtn) toggleBtn.remove(); } catch (e) {}
        try { if (panel) panel.remove(); } catch (e) {}
        try { delete w.__pixelDrawer; } catch (e) {}
        panel = null; toggleBtn = null;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUI);
    else setTimeout(buildUI, 300);
    console.log('[pixel_drawer] photo 8x8 v2.1 ready');
})();
