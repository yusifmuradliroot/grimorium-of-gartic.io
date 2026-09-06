// ==UserScript==
// @name         Omni
// @namespace    voyager
// @version      3.4
// @description  Omni loader — verifies itself by content hash, then runs the framework (.fs via embedded runner).
// @match        https://gartic.io/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const ar = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (ar.__omniVoyager) return;
    ar.__omniVoyager = true;

    
    
    
    try { ar.__voyagerHash = '38c73d7d'; } catch (e) {}

    
    var ForgeScript={version:4,h:function(s){var h=0x811c9dc5,af=0;for(;af<s.length;af++){h^=s.charCodeAt(af);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);},b:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var al=t.slice(l+1),m=al.indexOf("\n");if(m<0)return null;var o=null;try{o=JSON.parse(al.slice(0,m));}catch(e){return null;}var d=al.slice(m+1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<1)return null;var c=[],af,j,q=[],t=0;for(af=0;af<o.o.length;af++){if(o.o[af]<0||o.o[af]>=d.length)return null;c.push(d[o.o[af]]);var s=atob(d[o.o[af]]),k=(90^((af*31+7)%256)),u=new Uint8Array(s.length);for(j=0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("FS:2\n"+o.o.join(",")+"\n"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0;for(af=0;af<q.length;af++){a.set(q[af],p);p+=q[af].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var a=Date.now();debugger;if(Date.now()-a>100)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const n = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b367535373433752c35233b3d3f28752c35233b3d3f28742f293f28743029");
    const g = n;
    const f = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b36753537343375353734337535373433743c29");

    
    function ab(url, cb, eb) {
        const ad = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            fetch(ad, { cache: 'no-store' }).then(al => {
                if (!al.ok) throw new Error('fetch ' + al.status);
                return al.text();
            }).then(cb).catch(e => eb && eb(String(e)));
        } catch (e) { eb && eb(String(e)); }
    }
    
    function ac(str) {
        let h = 0x811c9dc5;
        for (let af = 0; af < str.length; af++) {
            h ^= str.charCodeAt(af);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        return ('0000000' + h.toString(16)).slice(-8);
    }
    function ak() {
        try { return ar.__voyagerHash || ''; } catch (e) { return ''; }
    }
    
    function an(src) {
        
        
        const as = src.replace(/(__voyagerHash\s*=\s*['"])[^'"]{8}(['"])/, __f("7e6b6a6a6a6a6a6a6a6a7e68"));
        if (as === src) return null;
        return ac(as);
    }
    function aq(mode, detail) {
        function ao() {
            if (!document.body) { setTimeout(ao, 200); return; }
            const aj = document.createElement('div');
            aj.id = __f("35373433772c35233b3d3f28773836353931");
            aj.style.cssText = __f("2a3529332e333534603c33223f3e7a7b33372a35282e3b342e613334293f2e606a7a7b33372a35282e3b342e61207733343e3f2260686b6e6d6e62696c6e6d7a7b33372a35282e3b342e61383b39313d28352f343e6079626a626a626a7a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613b36333d3477332e3f372960393f342e3f287a7b33372a35282e3b342e61302f292e333c23773935342e3f342e60393f342e3f287a7b33372a35282e3b342e613c35342e773c3b37333623601b28333b3676293b342977293f28333c7a7b33372a35282e3b342e61");
            const y = document.createElement('div');
            y.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a35282e3b342e61373b22772d333e2e326063682c2d7a7b33372a35282e3b342e61383b39313d28352f343e60796b3f686d683f7a7b33372a35282e3b342e613835283e3f2860682a227a293536333e7a79396a696368387a7b33372a35282e3b342e613835283e3f2877283b3e332f29606b682a227a7b33372a35282e3b342e613835227729323b3e352d606a7a622a227a69682a227a283d383b726a766a766a76746f737a7b33372a35282e3b342e61393536352860793f393c6a3c6b7a7b33372a35282e3b342e61352c3f283c36352d6032333e3e3f347a7b33372a35282e3b342e61");
            const ae = document.createElement('div');
            ae.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a227a7b33372a35282e3b342e61383b39313d28352f343e6079396a696368387a7b33372a35282e3b342e613c35342e606d6a6a7a6b6e2a227a1b28333b367a7b33372a35282e3b342e61");
            ae.textContent = mode === 'mismatch' ? __f("153734337a36353b3e3f287a352f2e3e3b2e3f3e") : __f("153734337a36353b3e3f287a3f28283528");
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613c363f22773e33283f392e333534603935362f37347a7b33372a35282e3b342e613d3b2a606b6e2a227a7b33372a35282e3b342e613c35342e606b692a22756b746f7a1b28333b367a7b33372a35282e3b342e61");
            const ai = document.createElement('div');
            const v = document.createElement('a');
            v.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
            if (mode === 'mismatch') {
                ai.textContent = __f("0e3233297a36353b3e3f287a39352a237a3e353f297a34352e7a373b2e39327a2e323f7a2a2f38363329323f3e7a35343f747a0a363f3b293f7a2f2a3e3b2e3f7a373b342f3b36362374");
                v.href = g;
                v.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f293f28743029");
            } else {
                ai.textContent = __f("153734337a36353b3e3f287a39352f363e7a34352e7a2c3f28333c237a332e293f363c7a72") + detail + __f("73747a19323f39317a23352f287a393534343f392e3335347a3b343e7a283f36353b3e74");
                v.href = '#';
                v.textContent = 'Reload page';
                v.addEventListener('click', e => { e.preventDefault(); try { location.reload(); } catch (z) {} });
            }
            body.appendChild(ai);
            body.appendChild(v);
            y.appendChild(ae);
            y.appendChild(body);
            aj.appendChild(y);
            document.body.appendChild(aj);
        }
        if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), ao);
        else ao();
    }
    function aa(code, src) {
        
        if (typeof code !== 'string' || code.indexOf('FS:2\n') !== 0) {
            try { aq('error', 'bad payload'); } catch (e) {}
            return false;
        }
        try {
            ForgeScript.run(code);
            return true;
        } catch (e) {
            try { aq('error', 'exec fail'); } catch (x) {}
            return false;
        }
    }
    function ag() {
        ab(f,
            code => { aa(code, f); },
            () => aq('error', __f("3c283b373f2d3528317a2f34283f3b39323b38363f")));
    }
    function ap() {
        ab(n, src => {
            const ah = ak();
            const am = an(src);
            if (!ah || ah === '........' || !am) { aq('error', __f("2f342c3f28333c333b38363f")); return; }
            if (ah === am) ag();
            else aq('mismatch', '');
        }, z => aq('error', z));
    }
    ap();
})();
