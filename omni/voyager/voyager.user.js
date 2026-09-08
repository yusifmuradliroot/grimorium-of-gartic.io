// ==UserScript==
// @name         Omni
// @namespace    voyager
// @version      3.4
// @description  Voyager · part of Omni.
// @match        https://gartic.io/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
;var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (w.__omniVoyager) return;
    w.__omniVoyager = !0;

    
    
    
    try { w.__voyagerHash = '6f6e0e60'; } catch (e) {}

    
    var ForgeScript={version:0x5,h:function(s){var h=0x811c9dc5,af=0x0;for(;af<s.length;af++){h^=s.charCodeAt(af);h=Math.imul(h,0x01000193)>>>0x0;}return ("0000000"+h.toString(0x10)).slice(-0x8);},b:function(t){var l=t.indexOf("\n");if(l<0x0||t.slice(0x0,l)!=="FS:2")return null;var al=t.slice(l+0x1),m=al.indexOf("\n");if(m<0x0)return null;var o=null;try{o=JSON.parse(al.slice(0x0,m));}catch(e){return null;}var d=al.slice(m+0x1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<0x1)return null;var c=[],af,j,q=[],t=0x0;for(af=0x0;af<o.o.length;af++){if(o.o[af]<0x0||o.o[af]>=d.length)return null;var w=d[o.o[af]],kb=0x0;if(o.k){try{var aq=[];for(j=0x0;j<0x8;j+=0x2)aq.push(parseInt(o.k.substr(j,0x2),0x10));var ap=aq[af%aq.length]%w.length;if(ap)w=w.slice(-ap)+w.slice(0x0,-ap);kb=aq[af%aq.length];}catch(x){return null;}}c.push(w);var s=atob(w),k=(0x5a^((af*0x1f+0x7)%0x100)^kb),u=new Uint8Array(s.length);for(j=0x0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("FS:2\n"+o.o.join(",")+"\n"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0x0;for(af=0x0;af<q.length;af++){a.set(q[af],p);p+=q[af].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\n");if(l<0x0||t.slice(0x0,l)!=="FS:2")return null;var a=Date.now();debugger;if(Date.now()-a>0x64)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const n = __f("322e2e2a29607575283b2d743d332e32")+__f("2f382f293f283935342e3f342e743935")+__f("3775232f29333c372f283b3e36332835")+__f("352e753d2833373528332f3777353c77")+__f("3d3b282e3339743335753b3f2e323f28")+__f("333b367535373433752c35233b3d3f28")+__f("752c35233b3d3f28742f293f28743029");
    const g = n;
    const f = __f("322e2e2a29607575283b2d743d332e32")+__f("2f382f293f283935342e3f342e743935")+__f("3775232f29333c372f283b3e36332835")+__f("352e753d2833373528332f3777353c77")+__f("3d3b282e3339743335753b3f2e323f28")+__f("333b3675353734337535373433753537")+__f("3433743c29");

    
    function ab(url, cb, eb) {
        const ad = url + (url.indexOf('?') === -0x1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            fetch(ad, { cache: 'no-store' }).then(al => {
                if (!al.ok) throw new Error('fetch ' + al.status);
                return al.text();
            }).then(cb).catch(e => eb && eb(String(e)));
        } catch (e) { eb && eb(String(e)); }
    }
    
    function ac(str) {
        let h = 0x811c9dc5;
        for (let af = 0x0; af < str.length; af++) {
            h ^= str.charCodeAt(af);
            h = Math.imul(h, 0x01000193) >>> 0x0;
        }
        return ('0000000' + h.toString(0x10)).slice(-0x8);
    }
    function ak() {
        try { return w.__voyagerHash || ''; } catch (e) { return ''; }
    }
    
    function an(src) {
        
        
        const at = src.replace(/(__voyagerHash\s*=\s*['"])[^'"]{8}(['"])/, __f("7e6b6a6a6a6a6a6a6a6a7e68"));
        if (at === src) return null;
        return ac(at);
    }
    function as(mode, detail) {
        function ao() {
            if (!document.body) { setTimeout(ao, 0xc8); return; }
            const aj = document.createElement('div');
            aj.id = __f("35373433772c35233b3d3f2877383635")+__f("3931");
            aj.style.cssText = __f("2a3529332e333534603c33223f3e7a7b")+__f("33372a35282e3b342e613334293f2e60")+__f("6a7a7b33372a35282e3b342e61207733")+__f("343e3f2260686b6e6d6e62696c6e6d7a")+__f("7b33372a35282e3b342e61383b39313d")+__f("28352f343e6079626a626a626a7a7b33")+__f("372a35282e3b342e613e33292a363b23")+__f("603c363f227a7b33372a35282e3b342e")+__f("613b36333d3477332e3f372960393f34")+__f("2e3f287a7b33372a35282e3b342e6130")+__f("2f292e333c23773935342e3f342e6039")+__f("3f342e3f287a7b33372a35282e3b342e")+__f("613c35342e773c3b37333623601b2833")+__f("3b3676293b342977293f28333c7a7b33")+__f("372a35282e3b342e61");
            const y = document.createElement('div');
            y.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a")+__f("35282e3b342e61373b22772d333e2e32")+__f("6063682c2d7a7b33372a35282e3b342e")+__f("61383b39313d28352f343e60796b3f68")+__f("6d683f7a7b33372a35282e3b342e6138")+__f("35283e3f2860682a227a293536333e7a")+__f("79396a696368387a7b33372a35282e3b")+__f("342e613835283e3f2877283b3e332f29")+__f("606b682a227a7b33372a35282e3b342e")+__f("613835227729323b3e352d606a7a622a")+__f("227a69682a227a283d383b726a766a76")+__f("6a76746f737a7b33372a35282e3b342e")+__f("61393536352860793f393c6a3c6b7a7b")+__f("33372a35282e3b342e61352c3f283c36")+__f("352d6032333e3e3f347a7b33372a3528")+__f("2e3b342e61");
            const ae = document.createElement('div');
            ae.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a")+__f("227a7b33372a35282e3b342e61383b39")+__f("313d28352f343e6079396a696368387a")+__f("7b33372a35282e3b342e613c35342e60")+__f("6d6a6a7a6b6e2a227a1b28333b367a7b")+__f("33372a35282e3b342e61");
            ae.textContent = mode === 'mismatch' ? __f("153734337a36353b3e3f287a352f2e3e")+__f("3b2e3f3e") : __f("153734337a36353b3e3f287a3f282835")+__f("28");
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b3337")+__f("2a35282e3b342e613e33292a363b2360")+__f("3c363f227a7b33372a35282e3b342e61")+__f("3c363f22773e33283f392e3335346039")+__f("35362f37347a7b33372a35282e3b342e")+__f("613d3b2a606b6e2a227a7b33372a3528")+__f("2e3b342e613c35342e606b692a22756b")+__f("746f7a1b28333b367a7b33372a35282e")+__f("3b342e61");
            const ai = document.createElement('div');
            const v = document.createElement('a');
            v.style.cssText = __f("3e33292a363b236038363539317a7b33")+__f("372a35282e3b342e612e3f222e773b36")+__f("333d3460393f342e3f287a7b33372a35")+__f("282e3b342e612a3b3e3e33343d606b68")+__f("2a227a7b33372a35282e3b342e61383b")+__f("39313d28352f343e6079686d3b3f6c6a")+__f("7a7b33372a35282e3b342e6139353635")+__f("2860793c3c3c7a7b33372a35282e3b34")+__f("2e613835283e3f2877283b3e332f2960")+__f("622a227a7b33372a35282e3b342e613c")+__f("35342e603835363e7a6b692a227a1b28")+__f("333b367a7b33372a35282e3b342e612e")+__f("3f222e773e3f3935283b2e3335346034")+__f("35343f7a7b33372a35282e3b342e61");
            if (mode === 'mismatch') {
                ai.textContent = __f("0e3233297a36353b3e3f287a39352a23")+__f("7a3e353f297a34352e7a373b2e39327a")+__f("2e323f7a2a2f38363329323f3e7a3534")+__f("3f747a0a363f3b293f7a2f2a3e3b2e3f")+__f("7a373b342f3b36362374");
                v.href = g;
                v.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f")+__f("293f28743029");
            } else {
                ai.textContent = __f("153734337a36353b3e3f287a39352f36")+__f("3e7a34352e7a2c3f28333c237a332e29")+__f("3f363c7a72") + detail + __f("73747a19323f39317a23352f287a3935")+__f("34343f392e3335347a3b343e7a283f36")+__f("353b3e74");
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
        
        if (typeof code !== 'string' || code.indexOf('FS:2\n') !== 0x0) {
            try { as('error', 'bad payload'); } catch (e) {}
            return !1;
        }
        try {
            ForgeScript.run(code);
            return !0;
        } catch (e) {
            try { as('error', 'exec fail'); } catch (x) {}
            return !1;
        }
    }
    function ag() {
        ab(f,
            code => { aa(code, f); },
            () => as('error', __f("3c283b373f2d3528317a2f34283f3b39")+__f("323b38363f")));
    }
    function ar() {
        ab(n, src => {
            const ah = ak();
            const am = an(src);
            if (!ah || ah === '........' || !am) { as('error', __f("2f342c3f28333c333b38363f")); return; }
            if (ah === am) ag();
            else as('mismatch', '');
        }, z => as('error', z));
    }
    ar();
})();
