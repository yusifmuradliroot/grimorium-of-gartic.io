// pixel_drawer — fixed 8x8 toggle grid, 1 packet per 250ms, minimal UI.
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

    const N = 8;
    const COLOR = '000000';
    const GAP = 250;
    const cells = new Array(N * N).fill(false);
    const queue = [];
    let timer = null;
    let panel = null, toggleBtn = null, gridEl = null, statusEl = null;

    function sid() {
        try { return Orbit.api.getMyWsId(); } catch (e) { return null; }
    }
    function send(p) {
        const s = sid();
        if (s == null) return false;
        try { return Orbit.hub.sendWS('42["10",' + s + ',' + JSON.stringify(p) + ']'); }
        catch (e) { return false; }
    }
    function layout() {
        const cw = 770, ch = 450;
        const s = Math.floor(Math.min(cw / N, ch / N));
        return { s: s, ox: Math.round((cw - N * s) / 2), oy: Math.round((ch - N * s) / 2) };
    }
    function start() {
        if (timer || sid() == null) { setStatus(sid() == null ? 'mywsid: waiting…' : 'busy'); return; }
        queue.length = 0;
        const L = layout();
        queue.push([27, '1']);
        queue.push([5, 'x' + COLOR]);
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            if (!cells[y * N + x]) continue;
            queue.push([1, 2, L.ox + x * L.s, L.oy + y * L.s, L.ox + (x + 1) * L.s, L.oy + (y + 1) * L.s]);
        }
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
        st.textContent = '#pd8-toggle{position:fixed;left:10px;top:8px;z-index:2147483647;padding:10px 16px;background:#222;color:#fff;border:2px solid #fff;border-radius:20px;font:bold 13px Arial;cursor:pointer}#pd8-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#1e272e;border:2px solid #fff;border-radius:12px;padding:14px;display:none;flex-direction:column;gap:10px}#pd8-grid{display:grid;grid-template-columns:repeat(8,22px);gap:2px;justify-content:center}.pd8-c{width:22px;height:22px;background:#fff;border:1px solid #555;padding:0;cursor:pointer}.pd8-c.on{background:#000}.pd8-row{display:flex;gap:8px}.pd8-row button{flex:1;padding:9px 0;border:none;border-radius:8px;color:#fff;font:bold 12px Arial;cursor:pointer}#pd8-start{background:#27ae60}#pd8-clear{background:#7f8c8d}#pd8-status{font:12px Arial;color:#b2bec3;text-align:center;min-height:15px}';
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
        gridEl = document.createElement('div');
        gridEl.id = 'pd8-grid';
        for (let i = 0; i < N * N; i++) {
            const c = document.createElement('button');
            c.className = 'pd8-c';
            c.dataset.i = i;
            c.addEventListener('click', () => {
                cells[i] = !cells[i];
                c.classList.toggle('on', cells[i]);
            });
            gridEl.appendChild(c);
        }
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
        statusEl.textContent = 'tap cells, then Start';
        const close = document.createElement('button');
        close.textContent = '×';
        close.style.cssText = 'position:absolute;top:4px;right:10px;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;';
        close.addEventListener('click', () => { panel.style.display = 'none'; toggleBtn.style.display = 'block'; });
        panel.style.position = 'fixed';
        panel.appendChild(close);
        panel.appendChild(gridEl);
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
    console.log('[pixel_drawer] 8x8 ready');
})();
