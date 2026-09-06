// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      3.0
// @description  Omni loader — self-checks its internal version, then runs the framework (.fs via embedded runner).
// @match        https://gartic.io/*
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const ax = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (ax.__omniVoyager) return;
    ax.__omniVoyager = true;

    
    
    
    
    try { ax.__voyagerVersion = '3.0'; } catch (e) {}
    const aa = (function () { try { return ax.__voyagerVersion || '0.0'; } catch (e) { return '0.0'; } })();

    
    var ForgeScript={version:4,h:function(s){var h=0x811c9dc5,aj=0;for(;aj<s.length;aj++){h^=s.charCodeAt(aj);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);},b:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var as=t.slice(l+1),am=as.indexOf("\n");if(am<0)return null;var o=null;try{o=JSON.parse(as.slice(0,am));}catch(e){return null;}var d=as.slice(am+1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<1)return null;var c=[],aj,j,q=[],t=0;for(aj=0;aj<o.o.length;aj++){if(o.o[aj]<0||o.o[aj]>=d.length)return null;c.push(d[o.o[aj]]);var s=atob(d[o.o[aj]]),k=(90^((aj*31+7)%256)),u=new Uint8Array(s.length);for(j=0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("FS:2\n"+o.o.join(",")+"\n"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0;for(aj=0;aj<q.length;aj++){a.set(q[aj],p);p+=q[aj].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var a=Date.now();debugger;if(Date.now()-a>100)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const z = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b367535373433752c35233b3d3f28752c35233b3d3f28742f293f28743029");
    const v = z;
    const g = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b36753537343375353734337535373433743c29");
    const f = __f("322e2e2a29607575393e347430293e3f36332c2874343f2e753d3275232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e33397433351a3b3f2e323f28333b36753537343375353734337535373433743c29");

    
    function ag(url, cb, eb) {
        const ah = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({ method: 'GET', url: ah, timeout: 15000,
                    onload: as => (as.status >= 200 && as.status < 400 && as.responseText) ? cb(as.responseText) : eb && eb('status ' + as.status),
                    onerror: () => eb && eb('onerror'), ontimeout: () => eb && eb('timeout') });
                return;
            }
            fetch(ah, { cache: 'no-store' }).then(as => {
                if (!as.ok) throw new Error('fetch ' + as.status);
                return as.text();
            }).then(cb).catch(e => eb && eb(String(e)));
        } catch (e) { eb && eb(String(e)); }
    }
    
    function ad(a, b) {
        const aq = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
        const ao = Math.max(aq.length, pb.length);
        for (let aj = 0; aj < ao; aj++) {
            const x = aq[aj] || 0, y = pb[aj] || 0;
            if (x !== y) return x < y ? -1 : 1;
        }
        return 0;
    }
    
    function ar(src) {
        const am = src.match(/__voyagerVersion\s*=\s*['"]([^'"]+)['"]/);
        return am ? am[1] : null;
    }
    function aw(mode, detail) {
        function au() {
            if (!document.body) { setTimeout(au, 200); return; }
            const ap = document.createElement('div');
            ap.id = __f("35373433772c35233b3d3f28773836353931");
            ap.style.cssText = __f("2a3529332e333534603c33223f3e7a7b33372a35282e3b342e613334293f2e606a7a7b33372a35282e3b342e61207733343e3f2260686b6e6d6e62696c6e6d7a7b33372a35282e3b342e61383b39313d28352f343e6079626a626a626a7a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613b36333d3477332e3f372960393f342e3f287a7b33372a35282e3b342e61302f292e333c23773935342e3f342e60393f342e3f287a7b33372a35282e3b342e613c35342e773c3b37333623601b28333b3676293b342977293f28333c7a7b33372a35282e3b342e61");
            const ac = document.createElement('div');
            ac.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a35282e3b342e61373b22772d333e2e326063682c2d7a7b33372a35282e3b342e61383b39313d28352f343e60796b3f686d683f7a7b33372a35282e3b342e613835283e3f2860682a227a293536333e7a79396a696368387a7b33372a35282e3b342e613835283e3f2877283b3e332f29606b682a227a7b33372a35282e3b342e613835227729323b3e352d606a7a622a227a69682a227a283d383b726a766a766a76746f737a7b33372a35282e3b342e61393536352860793f393c6a3c6b7a7b33372a35282e3b342e61352c3f283c36352d6032333e3e3f347a7b33372a35282e3b342e61");
            const ai = document.createElement('div');
            ai.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a227a7b33372a35282e3b342e61383b39313d28352f343e6079396a696368387a7b33372a35282e3b342e613c35342e606d6a6a7a6b6e2a227a1b28333b367a7b33372a35282e3b342e61");
            ai.textContent = mode === 'outdated' ? __f("153734337a36353b3e3f287a352f2e3e3b2e3f3e") : (mode === 'different' ? __f("153734337a36353b3e3f287a373329373b2e3932") : __f("153734337a36353b3e3f287a3f28283528"));
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613c363f22773e33283f392e333534603935362f37347a7b33372a35282e3b342e613d3b2a606b6e2a227a7b33372a35282e3b342e613c35342e606b692a22756b746f7a1b28333b367a7b33372a35282e3b342e61");
            const an = document.createElement('div');
            const ab = document.createElement('a');
            ab.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
            if (mode === 'outdated') {
                an.textContent = __f("1b7a343f2d3f287a36353b3e3f287a3f2233292e297a7223352f2829607a2c") + aa + ', latest: v' + detail + __f("73747a0a363f3b293f7a2f2a3e3b2e3f7a373b342f3b36362374");
                ab.href = v;
                ab.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f293f28743029");
            } else if (mode === 'different') {
                an.textContent = __f("03352f287a36353b3e3f287a3e353f297a34352e7a373b2e39327a2e323f7a2a2f38363329323f3e7a35343f7a7223352f2829607a2c") + aa + __f("767a2a2f38363329323f3e607a2c") + detail + __f("73747a083f3334292e3b36367a3b7a39363f3b347a39352a2374");
                ab.href = v;
                ab.textContent = __f("083f3334292e3b36367a2c35233b3d3f28742f293f28743029");
            } else {
                an.textContent = __f("153734337a36353b3e3f287a39352f363e7a34352e7a2c3f28333c237a332e297a2c3f28293335347a72") + detail + __f("73747a19323f39317a23352f287a393534343f392e3335347a3b343e7a283f36353b3e74");
                ab.href = '#';
                ab.textContent = 'Reload page';
                ab.addEventListener('click', e => { e.preventDefault(); try { location.reload(); } catch (ae) {} });
            }
            body.appendChild(an);
            body.appendChild(ab);
            ac.appendChild(ai);
            ac.appendChild(body);
            ap.appendChild(ac);
            document.body.appendChild(ap);
        }
        if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), au);
        else au();
    }
    function af(code, src) {
        
        if (typeof code !== 'string' || code.indexOf('FS:2\n') !== 0) {
            try { aw('error', 'bad payload'); } catch (e) {}
            return false;
        }
        try {
            ForgeScript.run(code);
            return true;
        } catch (e) {
            try { aw('error', 'exec fail'); } catch (x) {}
            return false;
        }
    }
    function al() {
        ag(g,
            code => { if (!af(code, g)) ak(); },
            () => ak());
    }
    function ak() {
        ag(f,
            code => { af(code, f); },
            () => aw('error', __f("3c283b373f2d3528317a2f34283f3b39323b38363f")));
    }
    function av() {
        ag(z, src => {
            const at = ar(src);
            if (!at) { aw('error', 'unparseable'); return; }
            const c = ad(aa, at);
            if (c === 0) al();
            else if (c < 0) aw('outdated', at);
            else aw('different', at);
        }, ae => aw('error', ae));
    }
    av();
})();
