// ==UserScript==
// @name         Gartic Loader — Universal Ecosystem
// @namespace    grimorium-loader
// @version      1.0
// @description  Universal loader with self-update and plugin manager. Fetches links.json, shows first-time setup, installs selected plugins, keeps backup and auto-updates.
// @match        https://gartic.io/*
// @match        https://*.gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
    'use strict';
    // --- Layer 1: Universal compatibility ---
    const gGet = (k,d)=>{ try{ if(typeof GM_getValue==='function') return GM_getValue(k,d); }catch(e){} try{ if(typeof GM!=='undefined'&&GM.getValue) return GM.getValue(k,d); }catch(e){} try{ const v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } };
    const gSet = (k,v)=>{ try{ if(typeof GM_setValue==='function') return GM_setValue(k,v); }catch(e){} try{ if(typeof GM!=='undefined'&&GM.setValue) return GM.setValue(k,v); }catch(e){} try{ localStorage.setItem(k, typeof v==='string'?v:JSON.stringify(v)); }catch(e){} };
    const gmXhr = (o)=>{ try{ if(typeof GM_xmlhttpRequest==='function') return GM_xmlhttpRequest(o); }catch(e){} try{ if(typeof GM!=='undefined'&&GM.xmlHttpRequest) return GM.xmlHttpRequest(o); }catch(e){} fetch(o.url,{cache:'no-store'}).then(r=>r.text().then(t=>o.onload&&o.onload({status:r.status,responseText:t}))).catch(e=>o.onerror&&o.onerror(e)); };
    const b64d = s=>{ try{ return atob(s); }catch(e){ return ''; } };

    // --- Layer 2: Loader core (self-update + backup) ---
    const LOADER_VER = (typeof GM_info!=='undefined'&&GM_info.script.version)||'1.0';
    const LOADER_STORE = 'gloader_current';
    const LOADER_BACKUP = 'gloader_prev';
    const LINKS_URL = 'https://cdn.jsdelivr.net/gh/yusifmuradliroot/grimorium-of-gartic.io@main/links.json';
    const LINKS_FALLBACK = 'https://raw.githubusercontent.com/yusifmuradliroot/grimorium-of-gartic.io/main/links.json';
    const PLUGIN_PREFIX = 'gplugin_';

    function fetchText(url, cb, eb, timeout){
        gmXhr({method:'GET', url:url+(url.indexOf('?')===-1?'?_='+Date.now():'&_='+Date.now()), headers:{'Cache-Control':'no-cache'}, timeout:timeout||12000,
            onload:r=>{ if(r.status>=200&&r.status<400&&r.responseText) cb(r.responseText); else eb('status '+r.status); },
            onerror:()=>eb('onerror'), ontimeout:()=>eb('timeout')});
    }

    function checkLoaderUpdate(cb){
        // version.json is inside links.json as loaderVersion, or separate file
        fetchText(LINKS_URL.replace('links.json','scripts/loader/version.json'), txt=>{
            try{
                const j=JSON.parse(txt);
                if(j.version && j.version!==LOADER_VER){
                    console.log('[loader] update available: '+LOADER_VER+' -> '+j.version);
                    // fetch new loader code (not auto-applied, just notify — manager handles payload updates)
                    // For test, we just log; real ecosystem would prompt user to update via Tampermonkey
                }
            }catch(e){}
            cb&&cb();
        }, ()=>cb&&cb());
    }

    // --- Layer 3: Plugin loader (links.json + first-time GUI) ---
    let executedPlugins = new Set();

    function executeCode(code, src, mustContain){
        if(mustContain && code.indexOf(mustContain)===-1){ console.warn('[loader] anti-tamper fail',src); return false; }
        try{ Function(code+'\n//# sourceURL='+src)(); console.log('[loader] executed '+src+' ('+code.length+' byte)'); return true; }catch(e){ console.error('[loader] execute fail',src,e); return false; }
    }

    function loadPlugin(plugin, onDone){
        const url = plugin.url, fallback = plugin.fallback;
        function tryFetch(u, isFallback){
            fetchText(u, code=>{
                const ok = executeCode(code, u, plugin.mustContain);
                if(ok){
                    // save current, backup previous
                    try{
                        const prev = gGet(PLUGIN_PREFIX+plugin.id, null);
                        if(prev && prev!==code) gSet(PLUGIN_PREFIX+plugin.id+'_prev', prev);
                        gSet(PLUGIN_PREFIX+plugin.id, code);
                        gSet(PLUGIN_PREFIX+plugin.id+'_ver', plugin.version);
                    }catch(e){}
                    onDone&&onDone(true);
                } else {
                    // try backup
                    const backup = gGet(PLUGIN_PREFIX+plugin.id+'_prev', null) || gGet(PLUGIN_PREFIX+plugin.id, null);
                    if(backup && executeCode(backup, 'backup:'+plugin.id, plugin.mustContain)) onDone&&onDone(true);
                    else onDone&&onDone(false);
                }
            }, err=>{
                console.warn('[loader] plugin fetch fail',plugin.id,url,err);
                if(!isFallback && fallback && fallback!==u){
                    tryFetch(fallback, true);
                } else {
                    // try backup
                    const backup = gGet(PLUGIN_PREFIX+plugin.id, null);
                    if(backup && executeCode(backup, 'backup:'+plugin.id, plugin.mustContain)) onDone&&onDone(true);
                    else onDone&&onDone(false);
                }
            });
        }
        tryFetch(url, false);
    }

    function showFirstTimeGUI(links, onConfirm){
        if(document.getElementById('gloader-setup')) return;
        const overlay = document.createElement('div');
        overlay.id='gloader-setup';
        overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;';
        overlay.innerHTML = `
            <div style="background:#1e272e;border:1px solid #16a085;border-radius:12px;width:360px;max-height:80vh;overflow:auto;box-shadow:0 8px 28px rgba(0,0,0,.5);font-family:Arial,sans-serif;color:#ecf0f1;">
                <div style="padding:12px 16px;background:#16a085;font:700 14px Arial;color:#fff;display:flex;align-items:center;justify-content:space-between;">
                    <span>Gartic Loader — Setup</span>
                    <span style="cursor:pointer;font-size:18px;" id="gloader-close">×</span>
                </div>
                <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
                    <div style="font:12px Arial;color:#b2bec3;">Select plugins to install. You can change this later in Tampermonkey storage.</div>
                    <div id="gloader-list" style="display:flex;flex-direction:column;gap:8px;"></div>
                    <button id="gloader-install" style="padding:10px;background:#16a085;color:#fff;border:none;border-radius:8px;font:700 13px Arial;cursor:pointer;">Install Selected</button>
                    <div style="font:10px Arial;color:#7f8c8d;text-align:center;">Loader will auto-update plugins on next page load via links.json</div>
                </div>
            </div>
        `;
        function ensureBody(cb){
            if(document.body) cb();
            else setTimeout(()=>ensureBody(cb),100);
        }
        ensureBody(()=>{
            document.body.appendChild(overlay);
            const list = overlay.querySelector('#gloader-list');
            const plugins = links.plugins || [];
            plugins.forEach(p=>{
                const row=document.createElement('label');
                row.style.cssText='display:flex;gap:8px;align-items:flex-start;padding:8px;background:#2c3e50;border-radius:8px;cursor:pointer;';
                row.innerHTML=`
                    <input type="checkbox" value="${p.id}" checked style="margin-top:2px;accent-color:#16a085;">
                    <div style="flex:1;">
                        <div style="font:700 12px Arial;color:#ecf0f1;">${p.name}</div>
                        <div style="font:11px Arial;color:#95a5a6;">${p.description||''}</div>
                        <div style="font:10px monospace;color:#7f8c8d;">${p.id} v${p.version}</div>
                    </div>
                `;
                list.appendChild(row);
            });
            overlay.querySelector('#gloader-close').onclick=()=>overlay.remove();
            overlay.querySelector('#gloader-install').onclick=()=>{
                const checked=[...list.querySelectorAll('input:checked')].map(i=>i.value);
                gSet('gloader_selected', JSON.stringify(checked));
                overlay.remove();
                onConfirm&&onConfirm(checked);
            };
        });
    }

    function init(){
        // 1) self-update check (non-blocking)
        checkLoaderUpdate(()=>{
            // 2) fetch links.json
            fetchText(LINKS_URL, txt=>{
                let links;
                try{ links=JSON.parse(txt); }catch(e){ console.error('[loader] links.json parse fail',e); return; }
                // also try to load from backup if needed? For test, just use fetched
                try{ gSet('gloader_links_cache', txt); }catch(e){}
                const selectedRaw = gGet('gloader_selected', null);
                const isFirstTime = !selectedRaw;
                if(isFirstTime){
                    showFirstTimeGUI(links, (checked)=>{
                        const toLoad = links.plugins.filter(p=> checked.includes(p.id));
                        let idx=0;
                        function next(){
                            if(idx>=toLoad.length) return;
                            loadPlugin(toLoad[idx], ()=>{ idx++; next(); });
                        }
                        next();
                    });
                } else {
                    // not first time — load selected plugins, check for updates
                    let selected;
                    try{ selected=JSON.parse(selectedRaw); }catch(e){ selected=[]; }
                    const toLoad = links.plugins.filter(p=> selected.includes(p.id));
                    // also check if any selected plugin has newer version than stored
                    toLoad.forEach(p=>{
                        const storedVer = gGet(PLUGIN_PREFIX+p.id+'_ver', '0');
                        if(storedVer!==p.version){
                            console.log('[loader] update for '+p.id+': '+storedVer+' -> '+p.version);
                        }
                        loadPlugin(p, ()=>{});
                    });
                    // also execute already cached plugins immediately (no network) for speed?
                    // For test, we already fetch live; fallback will use cache
                }
            }, err=>{
                console.warn('[loader] links.json fetch fail',err);
                // try cached links.json
                const cached = gGet('gloader_links_cache', null);
                if(cached){
                    try{
                        const links=JSON.parse(cached);
                        const selectedRaw=gGet('gloader_selected', null);
                        if(selectedRaw){
                            let selected; try{ selected=JSON.parse(selectedRaw); }catch(e){ selected=[]; }
                            links.plugins.filter(p=> selected.includes(p.id)).forEach(p=> loadPlugin(p, ()=>{}));
                        }
                    }catch(e){}
                }
            });
        });
    }

    // start
    if(document.readyState==='loading'){
        // loader is document-start, but GUI needs body
        init();
    } else {
        init();
    }
})();
