var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};



(function () {
    'use strict';
    const bh = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (bh.Orbit && typeof bh.Orbit.verify === 'function') ? bh.Orbit : null;
    if (!Orbit) return;
    const bf = Orbit.verify(__f("2a33223f36053e283b2d3f28"));
    if (!bf || bf.indexOf(__f("2a33223f36053e283b2d3f28")) === -1) return;
    if (bh.__pixelDrawer) return;
    bh.__pixelDrawer = true;

    function o() { return bh.WsCore || null; }

    const j = 8;
    const a = 250;
    let ak = null;
    const av = [];
    let be = null;
    let ar = null, toggleBtn = null, previewEl = null, fileEl = null, statusEl = null;

    function ba() {
        const b = o();
        if (!b) return null;
        try { return b.getSid(); } catch (e) { return null; }
    }
    function ay(p) {
        const b = o();
        if (!b) return false;
        try { return b.sendDraw(p); } catch (e) { return false; }
    }
    function au(v) {
        const at = Math.round(v / 255 * 3);
        return Math.round(at / 3 * 255);
    }
    function am(r, g, b) {
        const al = x => (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
        return al(r) + al(g) + al(b);
    }
    function as(img) {
        const ac = document.createElement('canvas');
        ac.width = j; ac.height = j;
        const ctx = ac.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, j, j);
        const ap = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const ax = Math.min(j / ap, j / ih);
        const ah = Math.max(1, Math.round(ap * ax)), dh = Math.max(1, Math.round(ih * ax));
        ctx.drawImage(img, Math.round((j - ah) / 2), Math.round((j - dh) / 2), ah, dh);
        const ae = ctx.getImageData(0, 0, j, j).data;
        ak = [];
        for (let i = 0; i < j * j; i++) {
            ak.push([au(ae[i * 4]), au(ae[i * 4 + 1]), au(ae[i * 4 + 2])]);
        }
        ag();
        const aa = new Set(ak.map(p => am(p[0], p[1], p[2]))).size;
        az(j + 'x' + j + ' ready, ' + aa + ' colors — Start to draw');
    }
    function ag() {
        if (!previewEl || !ak) return;
        previewEl.width = j; previewEl.height = j;
        const ctx = previewEl.getContext('2d');
        for (let y = 0; y < j; y++) for (let x = 0; x < j; x++) {
            const p = ak[y * j + x];
            ctx.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
            ctx.fillRect(x, y, 1, 1);
        }
    }
    function aq() {
        const ad = 770, ch = 450;
        const s = Math.floor(Math.min(ad / j, ch / j));
        return { s: s, ox: Math.round((ad - j * s) / 2), oy: Math.round((ch - j * s) / 2) };
    }
    function bc() {
        if (be || !ak || ba() == null) { az(ba() == null ? 'mywsid: waiting…' : (!ak ? __f("2a3339317a3b7a2a32352e357a3c3328292e") : 'busy')); return; }
        av.length = 0;
        const c = aq();
        const t = new Map();
        for (let y = 0; y < j; y++) for (let x = 0; x < j; x++) {
            const p = ak[y * j + x];
            const an = am(p[0], p[1], p[2]);
            if (an === 'FFFFFF') continue;
            if (!t.has(an)) t.set(an, []);
            t.get(an).push([c.ox + x * c.s, c.oy + y * c.s, c.ox + (x + 1) * c.s, c.oy + (y + 1) * c.s]);
        }
        av.push([27, '1']);
        t.forEach((rects, an) => {
            av.push([5, 'x' + an]);
            rects.forEach(r => av.push([1, 2, r[0], r[1], r[2], r[3]]));
        });
        let i = 0;
        az('drawing 0/' + av.length);
        be = setInterval(() => {
            if (i >= av.length) { stop(); az('done: ' + av.length + ' packets'); return; }
            if (!ay(av[i])) { stop(); az('send failed'); return; }
            i++;
            az('drawing ' + i + '/' + av.length);
        }, a);
    }
    function stop() {
        if (be) { clearInterval(be); be = null; }
    }
    function u() {
        stop();
        az(ay([4]) ? __f("393b342c3b297a39363f3b283f3e") : 'mywsid: waiting…');
    }
    function az(m) { if (statusEl) statusEl.textContent = m; }
    
    function k(name) {
        const af = name !== 'light';
        if (ar) {
            ar.style.background = af ? '#1e272e' : '#ffffff';
            ar.style.borderColor = af ? '#fff' : '#222';
            ar.style.color = af ? '#fff' : '#222';
        }
        if (toggleBtn) {
            toggleBtn.style.background = af ? '#222' : '#eee';
            toggleBtn.style.color = af ? '#fff' : '#222';
            toggleBtn.style.borderColor = af ? '#fff' : '#222';
        }
    }
    function bi() {
        let ab = 'light';
        try { ab = Orbit.api.getTheme() || 'light'; } catch (e) {}
        k(ab);
        try { Orbit.events.on(__f("35373433772e323f373f7739323b343d3f"), ev => k(ev && ev.detail)); } catch (e) {}
    }

    function n() {
        if (ar || !document.body) return;
        const bb = document.createElement('style');
        bb.textContent = __f("792a3e62772e353d3d363f212a3529332e333534603c33223f3e61363f3c2e606b6a2a22612e352a60622a2261207733343e3f2260686b6e6d6e62696c6e6d612a3b3e3e33343d606b6a2a227a6b6c2a2261383b39313d28352f343e607968686861393536352860793c3c3c613835283e3f2860682a227a293536333e7a793c3c3c613835283e3f2877283b3e332f2960686a2a22613c35342e603835363e7a6b692a227a1b28333b3661392f28293528602a3533342e3f2827792a3e62772a3b343f36212a3529332e333534603c33223f3e612e352a606f6a7f61363f3c2e606f6a7f612e283b34293c352837602e283b3429363b2e3f72776f6a7f76776f6a7f7361207733343e3f2260686b6e6d6e62696c6e6d61383b39313d28352f343e60796b3f686d683f613835283e3f2860682a227a293536333e7a793c3c3c613835283e3f2877283b3e332f29606b682a22612a3b3e3e33343d606b6e2a22613e33292a363b23603435343f613c363f22773e33283f392e333534603935362f3734613d3b2a606b6a2a22613b36333d3477332e3f372960393f342e3f2827792a3e62772a283f2c333f2d212d333e2e32606b686a2a2261323f333d322e606b686a2a2261383b39313d28352f343e60793c3c3c613835283e3f28606b2a227a293536333e7a796f6f6f6133373b3d3f77283f343e3f2833343d602a33223f363b2e3f3e27792a3e62773c33363f382e34213e33292a363b23603836353931612e3f222e773b36333d3460393f342e3f28612a3b3e3e33343d60632a227a6b6e2a2261383b39313d28352f343e60796839693f6f6a61393536352860793f393c6a3c6b613835283e3f28606b2a227a293536333e7a793c3c3c613835283e3f2877283b3e332f2960622a22613c35342e603835363e7a6b682a227a1b28333b3661392f28293528602a3533342e3f2827792a3e62773c33363f213e33292a363b23603435343f27742a3e627728352d213e33292a363b23603c363f22613d3b2a60622a22612d333e2e32606b6a6a7f27742a3e627728352d7a382f2e2e3534213c363f22606b612a3b3e3e33343d60632a227a6a613835283e3f28603435343f613835283e3f2877283b3e332f2960622a2261393536352860793c3c3c613c35342e603835363e7a6b682a227a1b28333b3661392f28293528602a3533342e3f2827792a3e6277292e3b282e21383b39313d28352f343e6079686d3b3f6c6a27792a3e627739363f3b2821383b39313d28352f343e60796d3c6239623e27792a3e6277292e3b2e2f29213c35342e606b682a227a1b28333b3661393536352860793868383f3969612e3f222e773b36333d3460393f342e3f286137333477323f333d322e606b6f2a2261373b22772d333e2e3260686a6a2a2227");
        document.head.appendChild(bb);
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'pd8-toggle';
        toggleBtn.textContent = 'Pixel 8×8';
        toggleBtn.addEventListener('click', () => {
            const open = ar.style.display === 'flex';
            ar.style.display = open ? 'none' : 'flex';
            toggleBtn.style.display = open ? 'block' : 'none';
        });
        ar = document.createElement('div');
        ar.id = 'pd8-panel';
        previewEl = document.createElement('canvas');
        previewEl.id = 'pd8-preview';
        previewEl.width = j; previewEl.height = j;
        fileEl = document.createElement('input');
        fileEl.id = 'pd8-file';
        fileEl.type = 'file';
        fileEl.accept = 'image/*';
        fileEl.addEventListener('change', () => {
            const ai = fileEl.files && fileEl.files[0];
            if (!ai) return;
            const bg = URL.createObjectURL(ai);
            const ao = new Image();
            ao.onload = () => { URL.revokeObjectURL(bg); as(ao); };
            ao.onerror = () => { URL.revokeObjectURL(bg); az('load failed'); };
            ao.src = bg;
            fileEl.value = '';
        });
        const aj = document.createElement('label');
        aj.id = 'pd8-filebtn';
        aj.textContent = 'Pick photo';
        aj.appendChild(fileEl);
        const aw = document.createElement('div');
        aw.className = 'pd8-row';
        const bd = document.createElement('button');
        bd.id = 'pd8-start';
        bd.textContent = 'Start';
        bd.addEventListener('click', bc);
        const z = document.createElement('button');
        z.id = 'pd8-clear';
        z.textContent = 'Clear';
        z.addEventListener('click', u);
        aw.appendChild(bd);
        aw.appendChild(z);
        statusEl = document.createElement('div');
        statusEl.id = 'pd8-status';
        statusEl.textContent = __f("2a3339317a3b7a2a32352e357a3c3328292e");
        const close = document.createElement('button');
        close.textContent = '×';
        close.style.cssText = __f("2a3529332e333534603b382935362f2e3f612e352a606e2a226128333d322e606b6a2a2261383b39313d28352f343e603435343f613835283e3f28603435343f61393536352860793c3c3c613c35342e772933203f606b622a2261392f28293528602a3533342e3f2861");
        close.addEventListener('click', () => { ar.style.display = 'none'; toggleBtn.style.display = 'block'; });
        ar.style.position = 'fixed';
        ar.appendChild(close);
        ar.appendChild(previewEl);
        ar.appendChild(aj);
        ar.appendChild(aw);
        ar.appendChild(statusEl);
        document.body.appendChild(toggleBtn);
        document.body.appendChild(ar);
    }

    bh.OmniStop_pixel_drawer = function () {
        stop();
        try { if (toggleBtn) toggleBtn.remove(); } catch (e) {}
        try { if (ar) ar.remove(); } catch (e) {}
        try { delete bh.__pixelDrawer; } catch (e) {}
        ar = null; toggleBtn = null;
    };

    function l() {
        n();
        bi();
        
        setTimeout(() => { try { k(Orbit.api.getTheme() || 'light'); } catch (e) {} }, 500);
    }
    if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), l);
    else setTimeout(l, 300);
    console.log(__f("012a33223f36053e283b2d3f28077a2a32352e357a6222627a2c6874697a283f3b3e23"));
})();
