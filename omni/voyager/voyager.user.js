// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      2.2
// @description  Omni loader — self-checks version, then runs the framework (.fs via embedded runner).
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const ax = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (ax.__omniVoyager) return;
    ax.__omniVoyager = true;

    
    var p={version:2,h:function(s){var h=0x811c9dc5,aj=0;for(;aj<s.length;aj++){h^=s.charCodeAt(aj);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);},a:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:1")return null;var h=t.slice(l+1).replace(/\s+/g,""),s="",aj=0;for(;aj<h.length;aj+=2)s+=String.fromCharCode(parseInt(h.substr(aj,2),16)^90);return s;},b:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var at=t.slice(l+1),am=at.indexOf("\n");if(am<0)return null;var o=null;try{o=JSON.parse(at.slice(0,am));}catch(e){return null;}var d=at.slice(am+1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<1)return null;var e=[],aa=[],aj,j;for(aj=0;aj<o.o.length;aj++){if(o.o[aj]<0||o.o[aj]>=d.length)return null;aa.push(d[o.o[aj]]);var s=atob(d[o.o[aj]]),k=(90^((aj*31+7)%256)),u=new Uint8Array(s.length);for(j=0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;try{e.push(new TextDecoder().decode(u));}catch(x){return null;}}if(this.h("FS:2\n"+o.o.join(",")+"\n"+aa.join(""))!==o.s)return null;return e.join("");},run:function(t){var l=t.indexOf("\n");if(l<0)return null;var ah=t.slice(0,l);if(ah!=="FS:1"&&ah!=="FS:2")return null;var a=Date.now();debugger;if(Date.now()-a>100)return null;var aa=null;try{aa=ah==="FS:1"?this.a(t):this.b(t);if(aa==null)return null;return Function(aa)();}finally{aa="";t="";}}};


    const z = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b367535373433752c35233b3d3f28752c35233b3d3f28742f293f28743029");
    const q = z;
    const n = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b36753537343375353734337535373433743c29");
    const f = __f("322e2e2a29607575393e347430293e3f36332c2874343f2e753d3275232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e33397433351a3b3f2e323f28333b36753537343375353734337535373433743c29");

    function aq() {
        try {
            const v = GM_info && GM_info.script && GM_info.script.version;
            return (typeof v === 'string' && v) ? v : null;
        } catch (e) { return null; }
    }
    function af(url, cb, eb) {
        const ag = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: ag, timeout: 10000,
                    onload: at => (at.status >= 200 && at.status < 400 && at.responseText) ? cb(at.responseText) : eb && eb('status ' + at.status),
                    onerror: () => eb && eb('onerror'), ontimeout: () => eb && eb('timeout') });
            } else if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                GM.xmlHttpRequest({ method: 'GET', url: ag,
                    onload: at => (at.status >= 200 && at.status < 400 && at.responseText) ? cb(at.responseText) : eb && eb('status'),
                    onerror: () => eb && eb('onerror') });
            } else {
                fetch(ag, { cache: 'no-store' }).then(at => { if (!at.ok) throw new Error('fetch ' + at.status); return at.text(); }).then(cb).catch(e => eb && eb(String(e)));
            }
        } catch (e) { eb && eb(String(e)); }
    }
    function as(src) {
        const am = src.match(/@version\s+(\S+)/);
        return am ? am[1] : null;
    }
    function aw(mode, detail) {
        function av() {
            if (!document.body) { setTimeout(av, 200); return; }
            const ap = document.createElement('div');
            ap.id = __f("35373433772c35233b3d3f28773836353931");
            ap.style.cssText = __f("2a3529332e333534603c33223f3e7a7b33372a35282e3b342e613334293f2e606a7a7b33372a35282e3b342e61207733343e3f2260686b6e6d6e62696c6e6d7a7b33372a35282e3b342e61383b39313d28352f343e6079626a626a626a7a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613b36333d3477332e3f372960393f342e3f287a7b33372a35282e3b342e61302f292e333c23773935342e3f342e60393f342e3f287a7b33372a35282e3b342e613c35342e773c3b37333623601b28333b3676293b342977293f28333c7a7b33372a35282e3b342e61");
            const ab = document.createElement('div');
            ab.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a35282e3b342e61373b22772d333e2e326063682c2d7a7b33372a35282e3b342e61383b39313d28352f343e60796b3f686d683f7a7b33372a35282e3b342e613835283e3f2860682a227a293536333e7a79396a696368387a7b33372a35282e3b342e613835283e3f2877283b3e332f29606b682a227a7b33372a35282e3b342e613835227729323b3e352d606a7a622a227a69682a227a283d383b726a766a766a76746f737a7b33372a35282e3b342e61393536352860793f393c6a3c6b7a7b33372a35282e3b342e61352c3f283c36352d6032333e3e3f347a7b33372a35282e3b342e61");
            const ai = document.createElement('div');
            ai.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a227a7b33372a35282e3b342e61383b39313d28352f343e6079396a696368387a7b33372a35282e3b342e613c35342e606d6a6a7a6b6e2a227a1b28333b367a7b33372a35282e3b342e61");
            ai.textContent = mode === 'outdated' ? __f("153734337a36353b3e3f287a352f2e3e3b2e3f3e") : __f("153734337a36353b3e3f287a3f28283528");
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613c363f22773e33283f392e333534603935362f37347a7b33372a35282e3b342e613d3b2a606b6e2a227a7b33372a35282e3b342e613c35342e606b692a22756b746f7a1b28333b367a7b33372a35282e3b342e61");
            const ao = document.createElement('div');
            if (mode === 'outdated') {
                ao.textContent = __f("35373433752c35233b3d3f287a33297a352f2e3e3b2e3f3e7a7223352f2829607a2c") + aq() + ', latest: v' + detail + __f("73747a0a363f3b293f7a2f2a3e3b2e3f7a373b342f3b36362374");
                const btn = document.createElement('a');
                btn.href = q;
                btn.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f293f28743029");
                btn.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
                body.appendChild(ao);
                body.appendChild(btn);
            } else {
                ao.textContent = __f("35373433752c35233b3d3f287a39352f363e7a34352e7a2c3f28333c237a332e297a2c3f28293335347a72") + detail + __f("73747a19323f39317a23352f287a393534343f392e3335347a3b343e7a283f36353b3e74");
                const btn = document.createElement('a');
                btn.href = '#';
                btn.textContent = 'Reload page';
                btn.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
                btn.addEventListener('click', e => { e.preventDefault(); try { location.reload(); } catch (ad) {} });
                body.appendChild(ao);
                body.appendChild(btn);
            }
            ab.appendChild(ai);
            ab.appendChild(body);
            ap.appendChild(ab);
            document.body.appendChild(ap);
        }
        if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), av);
        else av();
    }
    function ae(code, src) {
        
        if (typeof code !== 'string' || (code.indexOf('FS:2\n') !== 0 && code.indexOf('FS:1\n') !== 0)) {
            console.error(__f("0135373433077a3c283b373f2d3528317a33297a34352e7a3b7a743c297a2a3b2336353b3e607a") + src);
            return false;
        }
        try {
            p.run(code);
            console.log(__f("0135373433077a3c283b373f2d3528317a282f343433343d7a72") + src + ')');
            return true;
        } catch (e) {
            console.error(__f("0135373433077a3c283b373f2d3528317a3f223f397a3c3b3336"), e);
            return false;
        }
    }
    function al() {
        af(n,
            code => { if (!ae(code, n)) ak(); },
            () => ak());
    }
    function ak() {
        af(f,
            code => { ae(code, f); },
            ad => { console.error(__f("0135373433077a3c283b373f2d3528317a2f34283f3b39323b38363f"), ad); });
    }
    function ac(a, b) {
        const ar = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
        for (let aj = 0; aj < Math.max(ar.length, pb.length); aj++) {
            const x = ar[aj] || 0, y = pb[aj] || 0;
            if (x !== y) return x - y;
        }
        return 0;
    }

    const an = aq();
    console.log(__f("0135373433077a36353b3e3f287a2c") + an + ' — self-check first');
    if (an === null) {
        console.error(__f("0135373433077a393b3434352e7a283f3b3e7a352d347a2c3f28293335347a721d170533343c357a3733292933343d73"));
        aw('error', __f("352d347a2c3f28293335347a2f34283f3b3e3b38363f"));
        return;
    }
    af(z,
        code => {
            const au = as(code);
            if (!au) {
                console.error(__f("0135373433077a283f37352e3f7a2c3f28293335347a2f342a3b28293f3b38363f"));
                aw('error', __f("283f37352e3f7a2c3f28293335347a2f342a3b28293f3b38363f"));
                return;
            }
            if (ac(au, an) > 0) {
                console.error(__f("0135373433077a352f2e3e3b2e3f3e607a3635393b367a2c") + an + __f("7a2c297a283f37352e3f7a2c") + au);
                aw('outdated', au);
                return;
            }
            al();
        },
        ad => {
            console.error(__f("0135373433077a293f363c7739323f39317a3c3f2e39327a3c3b33363f3e"), ad);
            aw('error', __f("2c3f28293335347a39323f39317a2f34283f3b39323b38363f"));
        });
})();
