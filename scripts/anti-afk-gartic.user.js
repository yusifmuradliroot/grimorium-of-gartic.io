// ==UserScript==
// @name         Anti-AFK for Gartic.io (Proper)
// @namespace    https://github.com/yusifmuradliroot/grimorium-of-gartic.io
// @version      2.0.0
// @description  Proper anti-AFK using game's own event 42 mechanism
// @author       yusifmuradliroot
// @match        *://*.gartic.io/*
// @exclude      *://gartic.io/_next/*
// @exclude      *://gartic.io/static/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        KEEPALIVE_INTERVAL: 60000,
        ACTIVITY_INTERVAL: 120000,
        ENGINE_PING_INTERVAL: 25000,
        ENABLE_LOG: true
    };

    let gameSocket = null;
    let engineWs = null;
    let keepaliveTimer = null;
    let activityTimer = null;
    let enginePingTimer = null;
    let roomCode = null;
    let isInGame = false;
    let originalEmit = null;

    function log(...args) {
        if (CONFIG.ENABLE_LOG) console.log('[Anti-AFK]', ...args);
    }

    function sendGameKeepalive() {
        if (gameSocket && gameSocket.connected && roomCode) {
            try {
                gameSocket.emit(42, roomCode);
                log('Game keepalive sent (event 42)');
            } catch (e) {
                log('Game keepalive failed:', e);
            }
        }
    }

    function sendEnginePing() {
        if (engineWs && engineWs.readyState === WebSocket.OPEN) {
            try {
                engineWs.send('2');
                log('Engine.io ping sent');
            } catch (e) {
                log('Engine ping failed:', e);
            }
        }
    }

    function simulateActivity() {
        if (!isInGame) return;

        const events = ['mousemove', 'mousedown', 'mouseup', 'keydown'];
        const event = events[Math.floor(Math.random() * events.length)];
        const evt = new Event(event, { bubbles: true, cancelable: true });
        if (event === 'mousemove' || event === 'mousedown' || event === 'mouseup') {
            evt.clientX = window.innerWidth / 2 + (Math.random() - 0.5) * 10;
            evt.clientY = window.innerHeight / 2 + (Math.random() - 0.5) * 10;
        }
        document.dispatchEvent(evt);
        log('Activity simulated:', event);
    }

    function hookSocketIO() {
        if (!window.io) return;

        const OriginalIO = window.io;
        window.io = function(...args) {
            const socket = OriginalIO.apply(this, args);

            if (args[0] && typeof args[0] === 'string' && args[0].includes('gartic.io')) {
                gameSocket = socket;

                const transport = socket.io?.engine?.transport;
                if (transport?.ws) {
                    engineWs = transport.ws;
                    log('Engine.io WebSocket captured');
                    startEnginePing();
                }

                socket.on('connect', () => {
                    log('Socket.IO connected');
                    startKeepalive();
                });

                socket.on('disconnect', () => {
                    log('Socket.IO disconnected');
                    stopAll();
                });

                socket.on(32, () => {
                    log('Received inativo (32) - server says we are inactive');
                });

                socket.on(40, (code) => {
                    log('Received warning (40):', code);
                });

                originalEmit = socket.emit.bind(socket);
                socket.emit = function(event, ...args) {
                    if (event === 42 && args[0]) {
                        roomCode = args[0];
                        log('Room code captured:', roomCode);
                    }
                    if ([10, 11, 13, 16, 17, 19, 25, 34, 35, 36, 37, 39, 41, 42, 44, 45, 46].includes(event)) {
                        log('Game event sent:', event, args);
                    }
                    return originalEmit(event, ...args);
                };

                log('Game socket captured and hooked');
            }

            return socket;
        };
        Object.assign(window.io, OriginalIO);
    }

    function hookWebSocket() {
        const OriginalWS = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            const ws = new OriginalWS(url, protocols);

            if (url.includes('socket.io') || url.includes('gartic.io')) {
                ws.addEventListener('open', () => {
                    if (!engineWs) {
                        engineWs = ws;
                        log('WebSocket captured directly');
                        startEnginePing();
                    }
                });

                ws.addEventListener('close', () => {
                    if (ws === engineWs) {
                        engineWs = null;
                        stopEnginePing();
                    }
                });
            }

            return ws;
        };
        window.WebSocket.prototype = OriginalWS.prototype;
    }

    function detectGameState() {
        const checkInterval = setInterval(() => {
            const game = window.game;
            if (game && game._codigo) {
                roomCode = game._codigo;
                isInGame = true;
                if (game._socket) {
                    gameSocket = game._socket;
                    const transport = game._socket.io?.engine?.transport;
                    if (transport?.ws) engineWs = transport.ws;
                }
                startKeepalive();
                startActivitySimulation();
                clearInterval(checkInterval);
                log('Game detected, room:', roomCode);
            }
        }, 1000);

        setTimeout(() => clearInterval(checkInterval), 30000);
    }

    function startKeepalive() {
        stopKeepalive();
        keepaliveTimer = setInterval(sendGameKeepalive, CONFIG.KEEPALIVE_INTERVAL);
        sendGameKeepalive();
        log('Game keepalive started');
    }

    function stopKeepalive() {
        if (keepaliveTimer) {
            clearInterval(keepaliveTimer);
            keepaliveTimer = null;
        }
    }

    function startEnginePing() {
        stopEnginePing();
        enginePingTimer = setInterval(sendEnginePing, CONFIG.ENGINE_PING_INTERVAL);
        sendEnginePing();
        log('Engine ping started');
    }

    function stopEnginePing() {
        if (enginePingTimer) {
            clearInterval(enginePingTimer);
            enginePingTimer = null;
        }
    }

    function startActivitySimulation() {
        stopActivitySimulation();
        activityTimer = setInterval(simulateActivity, CONFIG.ACTIVITY_INTERVAL);
        log('Activity simulation started');
    }

    function stopActivitySimulation() {
        if (activityTimer) {
            clearInterval(activityTimer);
            activityTimer = null;
        }
    }

    function stopAll() {
        stopKeepalive();
        stopEnginePing();
        stopActivitySimulation();
        isInGame = false;
        roomCode = null;
        log('All timers stopped');
    }

    function handleVisibilityChange() {
        if (!document.hidden && isInGame) {
            simulateActivity();
            sendGameKeepalive();
        }
    }

    function init() {
        hookSocketIO();
        hookWebSocket();
        detectGameState();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', () => {
            if (isInGame) {
                simulateActivity();
                sendGameKeepalive();
            }
        });

        log('Anti-AFK initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();