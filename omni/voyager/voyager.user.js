// ==UserScript==
// @name         Omni
// @namespace    voyager
// @version      3.4
// @description  Voyager · part of Omni.
// @match        https://gartic.io/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
;var __t=["322e2e2a29607575283b2d743d332e32","2f382f293f283935342e3f342e743935","3775232f29333c372f283b3e36332835","352e753d2833373528332f3777353c77","3d3b282e3339743335753b3f2e323f28","333b367535373433752c35233b3d3f28","752c35233b3d3f28742f293f28743029","322e2e2a29607575283b2d743d332e32","2f382f293f283935342e3f342e743935","3775232f29333c372f283b3e36332835","352e753d2833373528332f3777353c77","3d3b282e3339743335753b3f2e323f28","333b3675353734337535373433753537","3433743c29","7e6b6a6a6a6a6a6a6a6a7e68","663d7a3c33363667783435343f787a29","2e2835313f6778392f28283f342e1935","363528787a292e2835313f773633343f","393b2a677828352f343e787a292e2835","313f773633343f30353334677828352f","343e787a292e2835313f772d333e2e32","6778687864662a3b2e327a292e283531","3f773e3b29323b28283b2367786c6a78","7a3e6778176b687a6936637a6b6d3277","6b6236637a776b6d007864663b343337","3b2e3f7a3c33363667783c283f3f203f","787a3b2e2e2833382f2e3f143b373f67","78292e2835313f773e3b2932353c3c29","3f2e787a3e2f2867786a746c29787a2c","3b362f3f2967786c6a616a7875646675","2a3b2e3264662a3b2e327a292e283531","3f773e3b29323b28283b2367786c787a","292e2835313f773e3b2932353c3c293f","2e67786c787a3e6778176b687a6b6a2c","6e7864663b3433373b2e3f7a3c333636","67783c283f3f203f787a3b2e2e283338","2f2e3f143b373f6778292e2835313f77","3e3b2932353c3c293f2e787a383f3d33","3467786a746d29787a3e2f2867786a74","6829787a2e3567786a78756466752a3b","2e3264662a3b2e327a292e2835313f77","3e3b29323b28283b2367786e787a292e","2835313f773e3b2932353c3c293f2e67","786e787a3e6778176b687a6b6d2c6a74","6a6b7864663b3433373b2e3f7a3c3336","3667783c283f3f203f787a3b2e2e2833","382f2e3f143b373f6778292e2835313f","773e3b2932353c3c293f2e787a383f3d","333467786a746d29787a3e2f2867786a","746829787a2e3567786a78756466752a","3b2e326466753d64","663d7a3c33363667783435343f787a29","2e2835313f6778392f28283f342e1935","363528787a292e2835313f773633343f","393b2a677828352f343e787a292e2835","313f773633343f30353334677828352f","343e787a292e2835313f772d333e2e32","6778687864662a3b2e327a292e283531","3f773e3b29323b28283b236778696e78","7a3e6778176b687a6c396974696b7a6a","7a6c7a68746c637a6c7a6c396a7a6974","696b7a7768746c637a6c7a776c7a6c39","776974696b7a6a7a776c7a7768746c63","7a776c7a776c2c7768746f7864663b34","33373b2e3f7a3c33363667783c283f3f","203f787a3b2e2e2833382f2e3f143b37","3f6778292e2835313f773e3b2932353c","3c293f2e787a3e2f2867786a746e2978","7a2c3b362f3f296778696e616a787564","66752a3b2e3264662a3b2e327a292e28","35313f773e3b29323b28283b23677862","787a292e2835313f773e3b2932353c3c","293f2e677862787a3e6778176c7a6336","77697a69176c7a6336697a697864663b","3433373b2e3f7a3c33363667783c283f","3f203f787a3b2e2e2833382f2e3f143b","373f6778292e2835313f773e3b293235","3c3c293f2e787a383f3d333467786a74","6e29787a3e2f2867786a746829787a2e","3567786a78756466752a3b2e32646675","3d64","66292c3d7a2c333f2d18352267786a7a","6a7a686e7a686e787a2d333e2e326778","787a3c33363667783435343f787a292e","23363f67782c3f282e33393b36773b36","333d346077692a227864","35373433772c35233b3d3f2877383635","3931","2a3529332e333534603c33223f3e7a7b","33372a35282e3b342e613334293f2e60","6a7a7b33372a35282e3b342e61207733","343e3f2260686b6e6d6e62696c6e6d7a","7b33372a35282e3b342e61383b39313d","28352f343e6079626a626a626a7a7b33","372a35282e3b342e613e33292a363b23","603c363f227a7b33372a35282e3b342e","613b36333d3477332e3f372960393f34","2e3f287a7b33372a35282e3b342e6130","2f292e333c23773935342e3f342e6039","3f342e3f287a7b33372a35282e3b342e","613c35342e773c3b37333623601b2833","3b3676293b342977293f28333c7a7b33","372a35282e3b342e61","7935373433772c35233b3d3f28773836","3539317a3b6032352c3f287a217a352a","3b39332e236074626f7a7b33372a3528","2e3b342e617a27","2d333e2e32606e686a2a227a7b33372a","35282e3b342e61373b22772d333e2e32","6063682c2d7a7b33372a35282e3b342e","61383b39313d28352f343e60796b3f68","6d683f7a7b33372a35282e3b342e6138","35283e3f2860682a227a293536333e7a","79396a696368387a7b33372a35282e3b","342e613835283e3f2877283b3e332f29","606b682a227a7b33372a35282e3b342e","613835227729323b3e352d606a7a622a","227a69682a227a283d383b726a766a76","6a76746f737a7b33372a35282e3b342e","61393536352860793f393c6a3c6b7a7b","33372a35282e3b342e61352c3f283c36","352d6032333e3e3f347a7b33372a3528","2e3b342e61","2a3b3e3e33343d606b682a227a6b6c2a","227a7b33372a35282e3b342e61383b39","313d28352f343e6079396a696368387a","7b33372a35282e3b342e613c35342e60","6d6a6a7a6b6e2a227a1b28333b367a7b","33372a35282e3b342e61","153734337a36353b3e3f287a352f2e3e","3b2e3f3e","153734337a36353b3e3f287a3f282835","28","2a3b3e3e33343d60686a2a227a7b3337","2a35282e3b342e613e33292a363b2360","3c363f227a7b33372a35282e3b342e61","3c363f22773e33283f392e3335346039","35362f37347a7b33372a35282e3b342e","613d3b2a606b6e2a227a7b33372a3528","2e3b342e613c35342e606b692a22756b","746f7a1b28333b367a7b33372a35282e","3b342e61","3e33292a363b236038363539317a7b33","372a35282e3b342e612e3f222e773b36","333d3460393f342e3f287a7b33372a35","282e3b342e612a3b3e3e33343d606b68","2a227a7b33372a35282e3b342e61383b","39313d28352f343e6079686d3b3f6c6a","7a7b33372a35282e3b342e6139353635","2860793c3c3c7a7b33372a35282e3b34","2e613835283e3f2877283b3e332f2960","622a227a7b33372a35282e3b342e613c","35342e603835363e7a6b692a227a1b28","333b367a7b33372a35282e3b342e612e","3f222e773e3f3935283b2e3335346034","35343f7a7b33372a35282e3b342e61","0e3233297a36353b3e3f287a39352a23","7a3e353f297a34352e7a373b2e39327a","2e323f7a2a2f38363329323f3e7a3534","3f747a0a363f3b293f7a2f2a3e3b2e3f","7a373b342f3b36362374","7a0f2a3e3b2e3f7a2c35233b3d3f2874","2f293f28743029","153734337a36353b3e3f287a39352f36","3e7a34352e7a2c3f28333c237a332e29","3f363c7a72","73747a19323f39317a23352f287a3935","34343f392e3335347a3b343e7a283f36","353b3e74","7a083f36353b3e7a2a3b3d3f","1e15171935342e3f342e16353b3e3f3e","3c283b373f2d3528317a2f34283f3b39","323b38363f","2f342c3f28333c333b38363f"];var __f=function(i){var s=__t[i],o='',j=0;for(;j<s.length;j+=2)o+=String.fromCharCode(parseInt(s.substr(j,2),16)^0x5a);return o;};
(function () {
    'use strict';
    const w = typeof unsafeWindow !== '\x75\x6e\x64\x65\x66\x69\x6e\x65\x64' ? unsafeWindow : window;
    if (w.__omniVoyager) return;
    w.__omniVoyager = !0;

    
    
    
    try { w.__voyagerHash = '3b09b54a'; } catch (e) {}

    
    var ForgeScript={version:0x5,h:function(s){var h=0x811c9dc5,al=0x0;for(;al<s.length;al++){h^=s.charCodeAt(al);h=Math.imul(h,0x01000193)>>>0x0;}return ("\x30\x30\x30\x30\x30\x30\x30"+h.toString(0x10)).slice(-0x8);},b:function(t){var l=t.indexOf("\x0a");if(l<0x0||t.slice(0x0,l)!=="\x46\x53\x3a\x32")return null;var au=t.slice(l+0x1),m=au.indexOf("\x0a");if(m<0x0)return null;var o=null;try{o=JSON.parse(au.slice(0x0,m));}catch(e){return null;}var d=au.slice(m+0x1).split("\x0a").filter(function(x){return x.length;});if(!o||!o.o||!o.s||o.o.length!==d.length||o.o.length<0x1)return null;var c=[],al,j,q=[],t=0x0;for(al=0x0;al<o.o.length;al++){if(o.o[al]<0x0||o.o[al]>=d.length)return null;var w=d[o.o[al]],kb=0x0;if(o.k){try{var az=[];for(j=0x0;j<0x8;j+=0x2)az.push(parseInt(o.k.substr(j,0x2),0x10));var ay=az[al%az.length]%w.length;if(ay)w=w.slice(-ay)+w.slice(0x0,-ay);kb=az[al%az.length];}catch(x){return null;}}c.push(w);var s=atob(w),k=(0x5a^((al*0x1f+0x7)%0x100)^kb),u=new Uint8Array(s.length);for(j=0x0;j<s.length;j++)u[j]=s.charCodeAt(j)^k;q.push(u);t+=u.length;}if(this.h("\x46\x53\x3a\x32\x0a"+o.o.join("\x2c")+"\x0a"+c.join(""))!==o.s)return null;var a=new Uint8Array(t),p=0x0;for(al=0x0;al<q.length;al++){a.set(q[al],p);p+=q[al].length;}try{return new TextDecoder().decode(a);}catch(x){return null;}},run:function(t){var l=t.indexOf("\x0a");if(l<0x0||t.slice(0x0,l)!=="\x46\x53\x3a\x32")return null;var a=Date.now();debugger;if(Date.now()-a>0x64)return null;var c=null;try{c=this.b(t);if(c==null)return null;return Function(c)();}finally{c="";t="";}}};


    const y = __f(0)+__f(1)+__f(2)+__f(3)+__f(4)+__f(5)+__f(6);
    const v = y;
    const f = __f(7)+__f(8)+__f(9)+__f(10)+__f(11)+__f(12)+__f(13);

    
    function ah(bd, ab, ae) {
        const aj = bd + (bd.indexOf('\x3f') === -0x1 ? '\x3f\x5f\x3d' + Date.now() : '\x26\x5f\x3d' + Date.now());
        try {
            fetch(aj, { cache: '\x6e\x6f\x2d\x73\x74\x6f\x72\x65' }).then(au => {
                if (!au.ok) throw new Error('\x66\x65\x74\x63\x68\x20' + au.status);
                return au.text();
            }).then(ab).catch(e => ae && ae(String(e)));
        } catch (e) { ae && ae(String(e)); }
    }
    
    function ai(bc) {
        let h = 0x811c9dc5;
        for (let al = 0x0; al < bc.length; al++) {
            h ^= bc.charCodeAt(al);
            h = Math.imul(h, 0x01000193) >>> 0x0;
        }
        return ('\x30\x30\x30\x30\x30\x30\x30' + h.toString(0x10)).slice(-0x8);
    }
    function at() {
        try { return w.__voyagerHash || ''; } catch (e) { return ''; }
    }
    
    function aw(src) {
        
        
        const be = src.replace(/(__voyagerHash\s*=\s*['"])[^'"]{8}(['"])/, __f(14));
        if (be === src) return null;
        return ai(be);
    }
    function bb(ap, ad) {
        
        var g = {
        'alert': __f(15)+__f(16)+__f(17)+__f(18)+__f(19)+__f(20)+__f(21)+__f(22)+__f(23)+__f(24)+__f(25)+__f(26)+__f(27)+__f(28)+__f(29)+__f(30)+__f(31)+__f(32)+__f(33)+__f(34)+__f(35)+__f(36)+__f(37)+__f(38)+__f(39)+__f(40)+__f(41)+__f(42)+__f(43)+__f(44)+__f(45)+__f(46)+__f(47)+__f(48)+__f(49)+__f(50),
        'rotate-270': __f(51)+__f(52)+__f(53)+__f(54)+__f(55)+__f(56)+__f(57)+__f(58)+__f(59)+__f(60)+__f(61)+__f(62)+__f(63)+__f(64)+__f(65)+__f(66)+__f(67)+__f(68)+__f(69)+__f(70)+__f(71)+__f(72)+__f(73)+__f(74)+__f(75)+__f(76)+__f(77)+__f(78)+__f(79)+__f(80)
        };
        function am(ar, s) {
            s = s || 0x12;
            var b = g[ar] || '';
            return __f(81)+__f(82) + s + '\x22\x20\x68\x65\x69\x67\x68\x74\x3d\x22' + s + __f(83)+__f(84)+__f(85) + b + '\x3c\x2f\x73\x76\x67\x3e';
        }
        function ax() {
            if (!document.body) { setTimeout(ax, 0xc8); return; }
            const as = document.createElement('\x64\x69\x76');
            as.id = __f(86)+__f(87);
            as.style.cssText = __f(88)+__f(89)+__f(90)+__f(91)+__f(92)+__f(93)+__f(94)+__f(95)+__f(96)+__f(97)+__f(98)+__f(99)+__f(100)+__f(101)+__f(102);
            const ak = document.createElement('\x73\x74\x79\x6c\x65');
            ak.textContent = __f(103)+__f(104)+__f(105)+__f(106);
            try { document.head.appendChild(ak); } catch (e) { try { as.appendChild(ak); } catch (x) {} }
            const aa = document.createElement('\x64\x69\x76');
            aa.style.cssText = __f(107)+__f(108)+__f(109)+__f(110)+__f(111)+__f(112)+__f(113)+__f(114)+__f(115)+__f(116)+__f(117)+__f(118)+__f(119)+__f(120)+__f(121)+__f(122);
            const head = document.createElement('\x64\x69\x76');
            head.style.cssText = __f(123)+__f(124)+__f(125)+__f(126)+__f(127)+__f(128);
            head.innerHTML = am('\x61\x6c\x65\x72\x74', 0x10) + '\x20';
            head.appendChild(document.createTextNode(ap === '\x6d\x69\x73\x6d\x61\x74\x63\x68' ? __f(129)+__f(130) : __f(131)+__f(132)));
            const body = document.createElement('\x64\x69\x76');
            body.style.cssText = __f(133)+__f(134)+__f(135)+__f(136)+__f(137)+__f(138)+__f(139)+__f(140)+__f(141);
            const aq = document.createElement('\x64\x69\x76');
            const z = document.createElement('\x61');
            z.style.cssText = __f(142)+__f(143)+__f(144)+__f(145)+__f(146)+__f(147)+__f(148)+__f(149)+__f(150)+__f(151)+__f(152)+__f(153)+__f(154)+__f(155);
            if (ap === '\x6d\x69\x73\x6d\x61\x74\x63\x68') {
                aq.textContent = __f(156)+__f(157)+__f(158)+__f(159)+__f(160);
                z.href = v;
                z.innerHTML = am('\x72\x6f\x74\x61\x74\x65\x2d\x32\x37\x30', 0x10) + __f(161)+__f(162);
            } else {
                aq.textContent = __f(163)+__f(164)+__f(165) + ad + __f(166)+__f(167)+__f(168);
                z.href = '\x23';
                z.innerHTML = am('\x72\x6f\x74\x61\x74\x65\x2d\x32\x37\x30', 0x10) + __f(169);
                z.addEventListener('\x63\x6c\x69\x63\x6b', e => { e.preventDefault(); try { location.reload(); } catch (af) {} });
            }
            body.appendChild(aq);
            body.appendChild(z);
            aa.appendChild(head);
            aa.appendChild(body);
            as.appendChild(aa);
            document.body.appendChild(as);
        }
        if (document.readyState === '\x6c\x6f\x61\x64\x69\x6e\x67') document.addEventListener(__f(170), ax);
        else ax();
    }
    function ag(ac, src) {
        
        if (typeof ac !== '\x73\x74\x72\x69\x6e\x67' || ac.indexOf('\x46\x53\x3a\x32\x0a') !== 0x0) {
            try { bb('\x65\x72\x72\x6f\x72', '\x62\x61\x64\x20\x70\x61\x79\x6c\x6f\x61\x64'); } catch (e) {}
            return !1;
        }
        try {
            ForgeScript.run(ac);
            return !0;
        } catch (e) {
            try { bb('\x65\x72\x72\x6f\x72', '\x65\x78\x65\x63\x20\x66\x61\x69\x6c'); } catch (x) {}
            return !1;
        }
    }
    function an() {
        ah(f,
            ac => { ag(ac, f); },
            () => bb('\x65\x72\x72\x6f\x72', __f(171)+__f(172)));
    }
    function ba() {
        ah(y, src => {
            const ao = at();
            const av = aw(src);
            if (!ao || ao === '........' || !av) { bb('\x65\x72\x72\x6f\x72', __f(173)); return; }
            if (ao === av) an();
            else bb('\x6d\x69\x73\x6d\x61\x74\x63\x68', '');
        }, af => bb('\x65\x72\x72\x6f\x72', af));
    }
    ba();
})();
