// ==UserScript==
// @name         Omni
// @namespace    voyager
// @version      3.4
// @description  Voyager · part of Omni.
// @match        https://gartic.io/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
;var __t=["322e2e2a29607575283b2d743d332e32","2f382f293f283935342e3f342e743935","3775232f29333c372f283b3e36332835","352e753d2833373528332f3777353c77","3d3b282e3339743335753b3f2e323f28","333b367535373433752c35233b3d3f28","752c35233b3d3f28742f293f28743029","322e2e2a29607575283b2d743d332e32","2f382f293f283935342e3f342e743935","3775232f29333c372f283b3e36332835","352e753d2833373528332f3777353c77","3d3b282e3339743335753b3f2e323f28","333b3675353734337535373433753537","3433743c29","7e6b6a6a6a6a6a6a6a6a7e68","35373433772c35233b3d3f2877383635","3931","2a3529332e333534603c33223f3e7a7b","33372a35282e3b342e613334293f2e60","6a7a7b33372a35282e3b342e61207733","343e3f2260686b6e6d6e62696c6e6d7a","7b33372a35282e3b342e61383b39313d","28352f343e6079626a626a626a7a7b33","372a35282e3b342e613e33292a363b23","603c363f227a7b33372a35282e3b342e","613b36333d3477332e3f372960393f34","2e3f287a7b33372a35282e3b342e6130","2f292e333c23773935342e3f342e6039","3f342e3f287a7b33372a35282e3b342e","613c35342e773c3b37333623601b2833","3b3676293b342977293f28333c7a7b33","372a35282e3b342e61","2d333e2e32606e686a2a227a7b33372a","35282e3b342e61373b22772d333e2e32","6063682c2d7a7b33372a35282e3b342e","61383b39313d28352f343e60796b3f68","6d683f7a7b33372a35282e3b342e6138","35283e3f2860682a227a293536333e7a","79396a696368387a7b33372a35282e3b","342e613835283e3f2877283b3e332f29","606b682a227a7b33372a35282e3b342e","613835227729323b3e352d606a7a622a","227a69682a227a283d383b726a766a76","6a76746f737a7b33372a35282e3b342e","61393536352860793f393c6a3c6b7a7b","33372a35282e3b342e61352c3f283c36","352d6032333e3e3f347a7b33372a3528","2e3b342e61","2a3b3e3e33343d606b682a227a6b6c2a","227a7b33372a35282e3b342e61383b39","313d28352f343e6079396a696368387a","7b33372a35282e3b342e613c35342e60","6d6a6a7a6b6e2a227a1b28333b367a7b","33372a35282e3b342e61","153734337a36353b3e3f287a352f2e3e","3b2e3f3e","153734337a36353b3e3f287a3f282835","28","2a3b3e3e33343d60686a2a227a7b3337","2a35282e3b342e613e33292a363b2360","3c363f227a7b33372a35282e3b342e61","3c363f22773e33283f392e3335346039","35362f37347a7b33372a35282e3b342e","613d3b2a606b6e2a227a7b33372a3528","2e3b342e613c35342e606b692a22756b","746f7a1b28333b367a7b33372a35282e","3b342e61","3e33292a363b236038363539317a7b33","372a35282e3b342e612e3f222e773b36","333d3460393f342e3f287a7b33372a35","282e3b342e612a3b3e3e33343d606b68","2a227a7b33372a35282e3b342e61383b","39313d28352f343e6079686d3b3f6c6a","7a7b33372a35282e3b342e6139353635","2860793c3c3c7a7b33372a35282e3b34","2e613835283e3f2877283b3e332f2960","622a227a7b33372a35282e3b342e613c","35342e603835363e7a6b692a227a1b28","333b367a7b33372a35282e3b342e612e","3f222e773e3f3935283b2e3335346034","35343f7a7b33372a35282e3b342e61","0e3233297a36353b3e3f287a39352a23","7a3e353f297a34352e7a373b2e39327a","2e323f7a2a2f38363329323f3e7a3534","3f747a0a363f3b293f7a2f2a3e3b2e3f","7a373b342f3b36362374","0f2a3e3b2e3f7a2c35233b3d3f28742f","293f28743029","153734337a36353b3e3f287a39352f36","3e7a34352e7a2c3f28333c237a332e29","3f363c7a72","73747a19323f39317a23352f287a3935","34343f392e3335347a3b343e7a283f36","353b3e74","1e15171935342e3f342e16353b3e3f3e","3c283b373f2d3528317a2f34283f3b39","323b38363f","2f342c3f28333c333b38363f"];var __f=function(i){var s=__t[i],o='',j=0;for(;j<s.length;j+=2)o+=String.fromCharCode(parseInt(s.substr(j,2),16)^0x5a);return o;};
(function () {
    'use strict';
    const w = typeof unsafeWindow !== '\x75\x6e\x64\x65\x66\x69\x6e\x65\x64' ? unsafeWindow : window;
    if (w.__omniVoyager) return;
    w.__omniVoyager = !0;

    
    
    
    try { w.__voyagerHash = '0752595b'; } catch (e) {}

    
    var ForgeScript={version:0x5,h:function(s){var h=0x811c9dc5,aj=0x0;for(;aj<s.length;aj++){h^=s.charCodeAt(aj);h=Math.imul(h,0x01000193)>>>0x0;}return ("\x30\x30\x30\x30\x30\x30\x30"+h.toString(0x10)).slice(-0x8);},b:function(t){var l=t.indexOf("\x0a");if(l<0x0||t.slice(0x0,l)!=="\x46\x53\x3a\x32")return null;var aq=t.slice(l+0x1),m=aq.indexOf("\x0a");if(m<0x0)return null;var o=null;try{o=JSON.parse(aq.slice(0x0,m));}catch(e){return null;}var d=aq.slice(m+0x1).split("\x0a").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<0x1)return null;var c=[],aj,j,q=[],t=0x0;for(aj=0x0;aj<o.o.length;aj++){if(o.o[aj]<0x0||o.o[aj]>=d.length)return null;var w=d[o.o[aj]],kb=0x0;if(o.k){try{var av=[];for(j=0x0;j<0x8;j+=0x2)av.push(parseInt(o.k.substr(j,0x2),0x10));var au=av[aj%av.length]%w.length;if(au)w=w.slice(-au)+w.slice(0x0,-au);kb=av[aj%av.length];}catch(x){return null;}}c.push(w);var s=atob(w),k=(0x5a^((aj*0x1f+0x7)%0x100)^kb),u=new Uint8Array(s.length);for(j=0x0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("\x46\x53\x3a\x32\x0a"+o.o.join("\x2c")+"\x0a"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0x0;for(aj=0x0;aj<q.length;aj++){a.set(q[aj],p);p+=q[aj].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\x0a");if(l<0x0||t.slice(0x0,l)!=="\x46\x53\x3a\x32")return null;var a=Date.now();debugger;if(Date.now()-a>0x64)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const n = __f(0)+__f(1)+__f(2)+__f(3)+__f(4)+__f(5)+__f(6);
    const g = n;
    const f = __f(7)+__f(8)+__f(9)+__f(10)+__f(11)+__f(12)+__f(13);

    
    function af(az, z, ac) {
        const ah = az + (az.indexOf('\x3f') === -0x1 ? '\x3f\x5f\x3d' + Date.now() : '\x26\x5f\x3d' + Date.now());
        try {
            fetch(ah, { cache: '\x6e\x6f\x2d\x73\x74\x6f\x72\x65' }).then(aq => {
                if (!aq.ok) throw new Error('\x66\x65\x74\x63\x68\x20' + aq.status);
                return aq.text();
            }).then(z).catch(e => ac && ac(String(e)));
        } catch (e) { ac && ac(String(e)); }
    }
    
    function ag(ay) {
        let h = 0x811c9dc5;
        for (let aj = 0x0; aj < ay.length; aj++) {
            h ^= ay.charCodeAt(aj);
            h = Math.imul(h, 0x01000193) >>> 0x0;
        }
        return ('\x30\x30\x30\x30\x30\x30\x30' + h.toString(0x10)).slice(-0x8);
    }
    function ap() {
        try { return w.__voyagerHash || ''; } catch (e) { return ''; }
    }
    
    function as(src) {
        
        
        const ba = src.replace(/(__voyagerHash\s*=\s*['"])[^'"]{8}(['"])/, __f(14));
        if (ba === src) return null;
        return ag(ba);
    }
    function ax(am, ab) {
        function at() {
            if (!document.body) { setTimeout(at, 0xc8); return; }
            const ao = document.createElement('\x64\x69\x76');
            ao.id = __f(15)+__f(16);
            ao.style.cssText = __f(17)+__f(18)+__f(19)+__f(20)+__f(21)+__f(22)+__f(23)+__f(24)+__f(25)+__f(26)+__f(27)+__f(28)+__f(29)+__f(30)+__f(31);
            const y = document.createElement('\x64\x69\x76');
            y.style.cssText = __f(32)+__f(33)+__f(34)+__f(35)+__f(36)+__f(37)+__f(38)+__f(39)+__f(40)+__f(41)+__f(42)+__f(43)+__f(44)+__f(45)+__f(46)+__f(47);
            const ai = document.createElement('\x64\x69\x76');
            ai.style.cssText = __f(48)+__f(49)+__f(50)+__f(51)+__f(52)+__f(53);
            ai.textContent = am === '\x6d\x69\x73\x6d\x61\x74\x63\x68' ? __f(54)+__f(55) : __f(56)+__f(57);
            const body = document.createElement('\x64\x69\x76');
            body.style.cssText = __f(58)+__f(59)+__f(60)+__f(61)+__f(62)+__f(63)+__f(64)+__f(65)+__f(66);
            const an = document.createElement('\x64\x69\x76');
            const v = document.createElement('\x61');
            v.style.cssText = __f(67)+__f(68)+__f(69)+__f(70)+__f(71)+__f(72)+__f(73)+__f(74)+__f(75)+__f(76)+__f(77)+__f(78)+__f(79)+__f(80);
            if (am === '\x6d\x69\x73\x6d\x61\x74\x63\x68') {
                an.textContent = __f(81)+__f(82)+__f(83)+__f(84)+__f(85);
                v.href = g;
                v.textContent = __f(86)+__f(87);
            } else {
                an.textContent = __f(88)+__f(89)+__f(90) + ab + __f(91)+__f(92)+__f(93);
                v.href = '\x23';
                v.textContent = '\x52\x65\x6c\x6f\x61\x64\x20\x70\x61\x67\x65';
                v.addEventListener('\x63\x6c\x69\x63\x6b', e => { e.preventDefault(); try { location.reload(); } catch (ad) {} });
            }
            body.appendChild(an);
            body.appendChild(v);
            y.appendChild(ai);
            y.appendChild(body);
            ao.appendChild(y);
            document.body.appendChild(ao);
        }
        if (document.readyState === '\x6c\x6f\x61\x64\x69\x6e\x67') document.addEventListener(__f(94), at);
        else at();
    }
    function ae(aa, src) {
        
        if (typeof aa !== '\x73\x74\x72\x69\x6e\x67' || aa.indexOf('\x46\x53\x3a\x32\x0a') !== 0x0) {
            try { ax('\x65\x72\x72\x6f\x72', '\x62\x61\x64\x20\x70\x61\x79\x6c\x6f\x61\x64'); } catch (e) {}
            return !1;
        }
        try {
            ForgeScript.run(aa);
            return !0;
        } catch (e) {
            try { ax('\x65\x72\x72\x6f\x72', '\x65\x78\x65\x63\x20\x66\x61\x69\x6c'); } catch (x) {}
            return !1;
        }
    }
    function ak() {
        af(f,
            aa => { ae(aa, f); },
            () => ax('\x65\x72\x72\x6f\x72', __f(95)+__f(96)));
    }
    function aw() {
        af(n, src => {
            const al = ap();
            const ar = as(src);
            if (!al || al === '........' || !ar) { ax('\x65\x72\x72\x6f\x72', __f(97)); return; }
            if (al === ar) ak();
            else ax('\x6d\x69\x73\x6d\x61\x74\x63\x68', '');
        }, ad => ax('\x65\x72\x72\x6f\x72', ad));
    }
    aw();
})();
