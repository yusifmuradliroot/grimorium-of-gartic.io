// ==UserScript==
// @name         Gartic Loader Test (Public)
// @namespace    grimorium-loader-test
// @version      1.0-test
// @description  Public test loader — fetches gartic-test-payload.js and executes it. If green "working" badge appears, loader works.
// @match        https://gartic.io/*
// @match        https://*.gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';
    const _cfg = {
        p0: 'aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL3l1c2lmbXVy',
        p1: 'YWRsaXJvb3QvZ3JpbW9yaXVtLW9mLWdhcnRpYy5pb0BtYWlu',
        p2: 'L3NjcmlwdHMvZ2FydGljLXRlc3QtcGF5bG9hZC5qcw==',
        f0: 'aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3l1c2lm',
        f1: 'bXVyYWRsaXJvb3QvZ3JpbW9yaXVtLW9mLWdhcnRpYy5pby9tYWlu',
        f2: 'L3NjcmlwdHMvZ2FydGljLXRlc3QtcGF5bG9hZC5qcw==',
        retry: 2,
        timeout: 12000,
        mustContain: 'garticTestPayloadLoaded',
        mode: 'function'
    };
    function b64d(s){ try{ return atob(s); }catch(e){ return ''; } }
    function getUrl(){ return {primary:b64d(_cfg.p0+_cfg.p1+_cfg.p2), fallback:b64d(_cfg.f0+_cfg.f1+_cfg.f2)}; }
    let executed=false;
    function execute(code,src){
        if(executed) return; executed=true;
        if(_cfg.mustContain && code.indexOf(_cfg.mustContain)===-1){ console.warn('[loader-test] anti-tamper missing',_cfg.mustContain,src); return; }
        try{
            if(_cfg.mode==='script'){ const el=document.createElement('script'); el.textContent=code+'\n//# sourceURL='+src; (document.head||document.documentElement).appendChild(el); }
            else { Function(code+'\n//# sourceURL='+src)(); }
            console.log('[loader-test] executed:',src,'('+code.length+' byte)');
        }catch(e){ console.error('[loader-test] execute error',e); }
    }
    function fetchViaGM(url,cb,eb){
        if(typeof GM_xmlhttpRequest==='function'){
            GM_xmlhttpRequest({method:'GET', url:url+(url.indexOf('?')===-1?'?_='+Date.now():'&_='+Date.now()), headers:{'Cache-Control':'no-cache'}, timeout:_cfg.timeout,
                onload:function(r){ if(r.status>=200&&r.status<400&&r.responseText) cb(r.responseText); else eb('GM status '+r.status); },
                onerror:function(){ eb('GM onerror'); }, ontimeout:function(){ eb('GM timeout'); }});
        } else {
            fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('fetch '+r.status); return r.text(); }).then(cb).catch(function(e){ eb(String(e)); });
        }
    }
    function loadWithRetry(url,fallback,attempt){
        attempt=attempt||0;
        fetchViaGM(url,function(code){ execute(code,url); },function(err){
            console.warn('[loader-test] fetch failed ('+(attempt+1)+'):',url,err);
            if(attempt<_cfg.retry) setTimeout(function(){ loadWithRetry(url,fallback,attempt+1); },900+Math.random()*600);
            else if(fallback&&fallback!==url){ console.log('[loader-test] fallback',fallback); loadWithRetry(fallback,null,0); }
            else console.error('[loader-test] all failed');
        });
    }
    try{
        const urls=getUrl();
        if(!urls.primary) return;
        loadWithRetry(urls.primary, urls.fallback, 0);
    }catch(e){ console.error('[loader-test] start',e); }
})();
