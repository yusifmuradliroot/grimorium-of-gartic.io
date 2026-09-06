// ==UserScript==
// @name         Omni
// @namespace    omni-loader
// @version      2.5
// @description  Omni loader — self-checks version, then runs the framework (.fs via embedded runner).
// @match        https://gartic.io/*
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
var __f=function(s){var o='',i=0;for(;i<s.length;i+=2){o+=String.fromCharCode(parseInt(s.substr(i,2),16)^0x5A);}return o;};
(function () {
    'use strict';
    const aw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (aw.__omniVoyager) return;
    aw.__omniVoyager = true;

    
    var n={version:3,h:function(s){var h=0x811c9dc5,ai=0;for(;ai<s.length;ai++){h^=s.charCodeAt(ai);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);},b:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var as=t.slice(l+1),al=as.indexOf("\n");if(al<0)return null;var o=null;try{o=JSON.parse(as.slice(0,al));}catch(e){return null;}var d=as.slice(al+1).split("\n").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<1)return null;var e=[],aa=[],ai,j;for(ai=0;ai<o.o.length;ai++){if(o.o[ai]<0||o.o[ai]>=d.length)return null;aa.push(d[o.o[ai]]);var s=atob(d[o.o[ai]]),k=(90^((ai*31+7)%256)),u=new Uint8Array(s.length);for(j=0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;try{e.push(new TextDecoder().decode(u));}catch(x){return null;}}if(this.h("FS:2\n"+o.o.join(",")+"\n"+aa.join(""))!==o.s)return null;return e.join("");},run:function(t){var l=t.indexOf("\n");if(l<0||t.slice(0,l)!=="FS:2")return null;var z=Date.now();debugger;if(Date.now()-z>100)return null;var aa=null;try{aa=this.b(t);if(aa==null)return null;return Function(aa)();}finally{aa="";t="";}}};


    const q = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b367535373433752c35233b3d3f28752c35233b3d3f28742f293f28743029");
    const p = q;
    const g = __f("322e2e2a29607575283b2d743d332e322f382f293f283935342e3f342e7439353775232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e3339743335753b3f2e323f28333b36753537343375353734337535373433743c29");
    const f = __f("322e2e2a29607575393e347430293e3f36332c2874343f2e753d3275232f29333c372f283b3e36332835352e753d2833373528332f3777353c773d3b282e33397433351a3b3f2e323f28333b36753537343375353734337535373433743c29");

    function ap() {
        try {
            const v = GM_info && GM_info.script && GM_info.script.version;
            return (typeof v === 'string' && v) ? v : null;
        } catch (e) { return null; }
    }
    
    
    function af(url, cb, eb) {
        const ag = url + (url.indexOf('?') === -1 ? '?_=' + Date.now() : '&_=' + Date.now());
        try {
            fetch(ag, { cache: 'no-store' }).then(as => {
                if (!as.ok) throw new Error('fetch ' + as.status);
                return as.text();
            }).then(cb).catch(e => eb && eb(String(e)));
        } catch (e) { eb && eb(String(e)); }
    }
    function ar(src) {
        const al = src.match(/@version\s+(\S+)/);
        return al ? al[1] : null;
    }
    function av(mode, detail) {
        function au() {
            if (!document.body) { setTimeout(au, 200); return; }
            const ao = document.createElement('div');
            ao.id = __f("35373433772c35233b3d3f28773836353931");
            ao.style.cssText = __f("2a3529332e333534603c33223f3e7a7b33372a35282e3b342e613334293f2e606a7a7b33372a35282e3b342e61207733343e3f2260686b6e6d6e62696c6e6d7a7b33372a35282e3b342e61383b39313d28352f343e6079626a626a626a7a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613b36333d3477332e3f372960393f342e3f287a7b33372a35282e3b342e61302f292e333c23773935342e3f342e60393f342e3f287a7b33372a35282e3b342e613c35342e773c3b37333623601b28333b3676293b342977293f28333c7a7b33372a35282e3b342e61");
            const ab = document.createElement('div');
            ab.style.cssText = __f("2d333e2e32606e686a2a227a7b33372a35282e3b342e61373b22772d333e2e326063682c2d7a7b33372a35282e3b342e61383b39313d28352f343e60796b3f686d683f7a7b33372a35282e3b342e613835283e3f2860682a227a293536333e7a79396a696368387a7b33372a35282e3b342e613835283e3f2877283b3e332f29606b682a227a7b33372a35282e3b342e613835227729323b3e352d606a7a622a227a69682a227a283d383b726a766a766a76746f737a7b33372a35282e3b342e61393536352860793f393c6a3c6b7a7b33372a35282e3b342e61352c3f283c36352d6032333e3e3f347a7b33372a35282e3b342e61");
            const ah = document.createElement('div');
            ah.style.cssText = __f("2a3b3e3e33343d606b682a227a6b6c2a227a7b33372a35282e3b342e61383b39313d28352f343e6079396a696368387a7b33372a35282e3b342e613c35342e606d6a6a7a6b6e2a227a1b28333b367a7b33372a35282e3b342e61");
            ah.textContent = mode === 'outdated' ? __f("153734337a36353b3e3f287a352f2e3e3b2e3f3e") : __f("153734337a36353b3e3f287a3f28283528");
            const body = document.createElement('div');
            body.style.cssText = __f("2a3b3e3e33343d60686a2a227a7b33372a35282e3b342e613e33292a363b23603c363f227a7b33372a35282e3b342e613c363f22773e33283f392e333534603935362f37347a7b33372a35282e3b342e613d3b2a606b6e2a227a7b33372a35282e3b342e613c35342e606b692a22756b746f7a1b28333b367a7b33372a35282e3b342e61");
            const an = document.createElement('div');
            if (mode === 'outdated') {
                an.textContent = __f("35373433752c35233b3d3f287a33297a352f2e3e3b2e3f3e7a7223352f2829607a2c") + ap() + ', latest: v' + detail + __f("73747a0a363f3b293f7a2f2a3e3b2e3f7a373b342f3b36362374");
                const btn = document.createElement('a');
                btn.href = p;
                btn.textContent = __f("0f2a3e3b2e3f7a2c35233b3d3f28742f293f28743029");
                btn.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
                body.appendChild(an);
                body.appendChild(btn);
            } else {
                an.textContent = __f("35373433752c35233b3d3f287a39352f363e7a34352e7a2c3f28333c237a332e297a2c3f28293335347a72") + detail + __f("73747a19323f39317a23352f287a393534343f392e3335347a3b343e7a283f36353b3e74");
                const btn = document.createElement('a');
                btn.href = '#';
                btn.textContent = 'Reload page';
                btn.style.cssText = __f("3e33292a363b236038363539317a7b33372a35282e3b342e612e3f222e773b36333d3460393f342e3f287a7b33372a35282e3b342e612a3b3e3e33343d606b682a227a7b33372a35282e3b342e61383b39313d28352f343e6079686d3b3f6c6a7a7b33372a35282e3b342e61393536352860793c3c3c7a7b33372a35282e3b342e613835283e3f2877283b3e332f2960622a227a7b33372a35282e3b342e613c35342e603835363e7a6b692a227a1b28333b367a7b33372a35282e3b342e612e3f222e773e3f3935283b2e333534603435343f7a7b33372a35282e3b342e61");
                btn.addEventListener('click', e => { e.preventDefault(); try { location.reload(); } catch (ad) {} });
                body.appendChild(an);
                body.appendChild(btn);
            }
            ab.appendChild(ah);
            ab.appendChild(body);
            ao.appendChild(ab);
            document.body.appendChild(ao);
        }
        if (document.readyState === 'loading') document.addEventListener(__f("1e15171935342e3f342e16353b3e3f3e"), au);
        else au();
    }
    function ae(code, src) {
        
        if (typeof code !== 'string' || code.indexOf('FS:2\n') !== 0) {
            ;
            return false;
        }
        try {
            n.run(code);
            ;
            return true;
        } catch (e) {
            ;
            return false;
        }
    }
    function ak() {
        af(g,
            code => { if (!ae(code, g)) aj(); },
            () => aj());
    }
    function aj() {
        af(f,
            code => { ae(code, f); },
            ad => { ; });
    }
    function ac(z, b) {
        const aq = String(z).split('.').map(Number), pb = String(b).split('.').map(Number);
        for (let ai = 0; ai < Math.max(aq.length, pb.length); ai++) {
            const x = aq[ai] || 0, y = pb[ai] || 0;
            if (x !== y) return x - y;
        }
        return 0;
    }

    const am = ap();
    ;
    if (am === null) {
        ;
        av('error', __f("352d347a2c3f28293335347a2f34283f3b3e3b38363f"));
        return;
    }
    af(q,
        code => {
            const at = ar(code);
            if (!at) {
                ;
                av('error', __f("283f37352e3f7a2c3f28293335347a2f342a3b28293f3b38363f"));
                return;
            }
            if (ac(at, am) > 0) {
                ;
                av('outdated', at);
                return;
            }
            ak();
        },
        ad => {
            ;
            av('error', __f("2c3f28293335347a39323f39317a2f34283f3b39323b38363f"));
        });
})();
