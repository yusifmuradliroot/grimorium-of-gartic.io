// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      3.1
// @description  Omni loader — self-checks its internal version, then runs the framework (.fs via embedded runner).
// @match        https://gartic.io/*
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const av = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (av.__omniVoyager) return;
    av.__omniVoyager = true;

    
    
    
    
    try { av.__voyagerVersion = '3.1'; } catch (e) {}
    const z = (function () { try { return av.__voyagerVersion || '0.0'; } catch (e) { return '0.0'; } })();

    
    var ForgeScript={version:4,h:function(s){var h=0x811c9dc5,ai=0;for(;ai<s.length;ai++){h^=s.charCodeAt(ai);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);},b:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var aq=t.slice(l+1),ak=aq.indexOf("\n");if(ak<0)return null;var o=null;try{o=JSON.parse(aq.slice(0,ak));}catch(e){return null;}var d=aq.slice(ak+1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<1)return null;var c=[],ai,j,q=[],t=0;for(ai=0;ai<o.o.length;ai++){if(o.o[ai]<0||o.o[ai]>=d.length)return null;c.push(d[o.o[ai]]);var s=atob(d[o.o[ai]]),k=(90^((ai*31+7)%256)),u=new Uint8Array(s.length);for(j=0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("FS:2\n"+o.o.join(",")+"\n"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0;for(ai=0;ai<q.length;ai++){a.set(q[ai],p);p+=q[ai].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var a=Date.now();debugger;if(Date.now()-a>100)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const v = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b367535373433752c35233b3d3f28752c35233b3d3f28742f293f28743029");
    const g = v;
    
    const f = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b36753537343375353734337535373433743c29");

    
    function af(url, cb, eb) {
        const ag = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: ag, timeout: 15000,
                    onload: aq => (aq.status >= 200 && aq.status < 400 && aq.responseText) ? cb(aq.responseText) : eb && eb('status ' + aq.status),
                    onerror: () => eb && eb('onerror'), ontimeout: () => eb && eb('timeout') });
                return;
            }
            fetch(ag, { cache: 'no-store' }).then(aq => {
                if (!aq.ok) throw new Error('fetch ' + aq.status);
                return aq.text();
            }).then(cb).catch(e => eb && eb(String(e)));
        } catch (e) { eb && eb(String(e)); }
    }
    
    function ac(a, b) {
        const ao = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
        const am = Math.max(ao.length, pb.length);
        for (let ai = 0; ai < am; ai++) {
            const x = ao[ai] || 0, y = pb[ai] || 0;
            if (x !== y) return x < y ? -1 : 1;
        }
        return 0;
    }
    
    function ap(src) {
        const ak = src.match(/__voyagerVersion\s*=\s*['"]([^'"]+)['"]/);
        return ak ? ak[1] : null;
    }
    function au(mode, detail) {
        function as() {
            if (!document.body) { setTimeout(as, 200); return; }
            const an = document.createElement('div');
            an.id = __f("35373433772c35233b3d3f28773836353931");
            an.style.cssText = __f("2a3529332e333534603c33223f3e7a7b33372a35282e3b342e613334293f2e606a7a7b33372a35282e3b342e61207733343e3f2260686b6e6d6e62696c6e6d7a7b33372a35282e3b342e61383b39313d28352f343e6079626a626a626a7a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613b36333d3477332e3f372960393f342e3f287a7b33372a35282e3b342e61302f292e333c23773935342e3f342e60393f342e3f287a7b33372a35282e3b342e613c35342e773c3b37333623601b28333b3676293b342977293f28333c7a7b33372a35282e3b342e61");
            const ab = document.createElement('div');
            ab.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a35282e3b342e61373b22772d333e2e326063682c2d7a7b33372a35282e3b342e61383b39313d28352f343e60796b3f686d683f7a7b33372a35282e3b342e613835283e3f2860682a227a293536333e7a79396a696368387a7b33372a35282e3b342e613835283e3f2877283b3e332f29606b682a227a7b33372a35282e3b342e613835227729323b3e352d606a7a622a227a69682a227a283d383b726a766a766a76746f737a7b33372a35282e3b342e61393536352860793f393c6a3c6b7a7b33372a35282e3b342e61352c3f283c36352d6032333e3e3f347a7b33372a35282e3b342e61");
            const ah = document.createElement('div');
            ah.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a227a7b33372a35282e3b342e61383b39313d28352f343e6079396a696368387a7b33372a35282e3b342e613c35342e606d6a6a7a6b6e2a227a1b28333b367a7b33372a35282e3b342e61");
            ah.textContent = mode === 'outdated' ? __f("153734337a36353b3e3f287a352f2e3e3b2e3f3e") : (mode === 'different' ? __f("153734337a36353b3e3f287a373329373b2e3932") : __f("153734337a36353b3e3f287a3f28283528"));
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613c363f22773e33283f392e333534603935362f37347a7b33372a35282e3b342e613d3b2a606b6e2a227a7b33372a35282e3b342e613c35342e606b692a22756b746f7a1b28333b367a7b33372a35282e3b342e61");
            const al = document.createElement('div');
            const aa = document.createElement('a');
            aa.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
            if (mode === 'outdated') {
                al.textContent = __f("1b7a343f2d3f287a36353b3e3f287a3f2233292e297a7223352f2829607a2c") + z + ', latest: v' + detail + __f("73747a0a363f3b293f7a2f2a3e3b2e3f7a373b342f3b36362374");
                aa.href = g;
                aa.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f293f28743029");
            } else if (mode === 'different') {
                al.textContent = __f("03352f287a36353b3e3f287a3e353f297a34352e7a373b2e39327a2e323f7a2a2f38363329323f3e7a35343f7a7223352f2829607a2c") + z + __f("767a2a2f38363329323f3e607a2c") + detail + __f("73747a083f3334292e3b36367a3b7a39363f3b347a39352a2374");
                aa.href = g;
                aa.textContent = __f("083f3334292e3b36367a2c35233b3d3f28742f293f28743029");
            } else {
                al.textContent = __f("153734337a36353b3e3f287a39352f363e7a34352e7a2c3f28333c237a332e297a2c3f28293335347a72") + detail + __f("73747a19323f39317a23352f287a393534343f392e3335347a3b343e7a283f36353b3e74");
                aa.href = '#';
                aa.textContent = 'Reload page';
                aa.addEventListener('click', e => { e.preventDefault(); try { location.reload(); } catch (ad) {} });
            }
            body.appendChild(al);
            body.appendChild(aa);
            ab.appendChild(ah);
            ab.appendChild(body);
            an.appendChild(ab);
            document.body.appendChild(an);
        }
        if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), as);
        else as();
    }
    function ae(code, src) {
        
        if (typeof code !== 'string' || code.indexOf('FS:2\n') !== 0) {
            try { au('error', 'bad payload'); } catch (e) {}
            return false;
        }
        try {
            ForgeScript.run(code);
            return true;
        } catch (e) {
            try { au('error', 'exec fail'); } catch (x) {}
            return false;
        }
    }
    function aj() {
        af(f,
            code => { ae(code, f); },
            () => au('error', __f("3c283b373f2d3528317a2f34283f3b39323b38363f")));
    }
    function at() {
        af(v, src => {
            const ar = ap(src);
            if (!ar) { au('error', 'unparseable'); return; }
            const c = ac(z, ar);
            if (c === 0) aj();
            else if (c < 0) au('outdated', ar);
            else au('different', ar);
        }, ad => au('error', ad));
    }
    at();
})();
