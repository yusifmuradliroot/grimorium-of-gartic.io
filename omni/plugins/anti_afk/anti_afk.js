// anti_afk — game-truth activity.
// From room.js analysis:
// - Server verdict "inactive" arrives as socket event 32 (no client popup to close).
// - Client heartbeat: idle >150s → emit(42, roomCode). We mirror it faster (120s).
// - Drawer idleness is measured by REAL DRAW PACKETS during the turn window.
//   So on our turn we scribble tiny strokes every 25s until the turn ends.
// - Word choices (16) have a short window: pick word 0 at 8s.
// - Counter-vote retaliation kept (verified Kawaii semantics).
// Wire mirrors the game client: 42[42,"CODE"], 42[34,"CODE",0], 42[45,...].
// Runs on WsCore bus + raw tap (dependency). Never touches raw WS directly.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM.

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('anti_afk');
    if (!token || token.indexOf('anti_afk') === -1) return;
    if (w.__antiAfk) return;
    w.__antiAfk = true;

    function bus() { return w.WsCore || null; }

    const HEARTBEAT_MS = 120000;
    const WORD_MS = 8000;
    const SCRIBBLE_MS = 25000;
    const VOTE_COOLDOWN_MS = 60000;
    let beatTimer = null;
    let wordTimer = null;
    let scribbleTimer = null;
    let scribbleN = 0;
    const votedAt = {};

    function roomCode() {
        try {
            const segs = (location.pathname || '').split('/').filter(s => s);
            if (segs.length && /^[A-Za-z0-9]{3,8}$/.test(segs[0])) return segs[0];
        } catch (e) {}
        return null;
    }
    function myId() {
        try { return Orbit.api.getMyId(); } catch (e) { return null; }
    }
    function bare(s) {
        return String(s == null ? '' : s).replace(/^"|"$/g, '');
    }
    function heartbeat() {
        const code = roomCode();
        const b = bus();
        if (!code || !b) return;
        try { b.sendRaw('42[42,"' + code + '"]'); } catch (e) {}
    }
    function guardWord() {
        wordTimer = null;
        const code = roomCode();
        const b = bus();
        if (!code || !b) return;
        try { b.sendRaw('42[34,"' + code + '",0]'); } catch (e) {}
        console.log('[anti_afk] word 0 picked');
    }
    function scribble() {
        const b = bus();
        if (!b) return;
        try {
            const x = 740 + (scribbleN % 5) * 4, y = 420 + (scribbleN % 3) * 4;
            b.sendDraw([2, x, y, x + 3, y + 2, x + 6, y]);
            scribbleN++;
        } catch (e) {}
    }
    function disarm() {
        if (wordTimer) { clearTimeout(wordTimer); wordTimer = null; }
        if (scribbleTimer) { clearInterval(scribbleTimer); scribbleTimer = null; }
    }
    function armTurn() {
        disarm();
        scribble();
        scribbleTimer = setInterval(scribble, SCRIBBLE_MS);
    }
    function onVotekick(voterRaw, targetRaw) {
        const me = myId();
        if (me == null) return;
        if (bare(targetRaw) !== String(me)) return;
        const voter = bare(voterRaw);
        if (!voter) return;
        const now = Date.now();
        if (votedAt[voter] && now - votedAt[voter] < VOTE_COOLDOWN_MS) return;
        const code = roomCode();
        if (!code) return;
        const b = bus();
        if (!b) return;
        const voterToken = /^\d+$/.test(voter) ? voter : '"' + voter + '"';
        let ok = false;
        try { ok = b.sendRaw('42[45,"' + code + '",[' + voterToken + ',true]]'); } catch (e) {}
        if (ok) {
            votedAt[voter] = now;
            console.log('[anti_afk] counter-vote against ' + voter);
        }
    }

    function boot() {
        const b = bus();
        if (!b) { setTimeout(boot, 500); return; }
        beatTimer = setInterval(heartbeat, HEARTBEAT_MS);
        // 16 = our word choices → pick fast, arm is implied (turn is ours).
        b.onPacket('16', () => {
            disarm();
            wordTimer = setTimeout(guardWord, WORD_MS);
        });
        // 17 = turn assign. Ours → scribble loop; others → stand down.
        b.onPacket('17', data => {
            const me = myId();
            if (me != null && String(data[1]) === String(me)) armTurn();
            else disarm();
        });
        // Raw tap for 38 (votekick): direct extract, no JSON dependency.
        try {
            Orbit.hub.onWS(msg => {
                if (msg == null || typeof msg.indexOf !== 'function') return;
                const P = '42[38,';
                const at = msg.indexOf(P);
                if (at < 0) return;
                const parts = msg.slice(at + P.length).split(',');
                if (parts.length < 3) return;
                onVotekick(parts[0], parts[1]);
            });
        } catch (e) {}
        console.log('[anti_afk] heartbeat + scribble guard + counter-vote active');
    }

    boot();

    w.OmniStop_anti_afk = function () {
        disarm();
        if (beatTimer) { clearInterval(beatTimer); beatTimer = null; }
        try { delete w.__antiAfk; } catch (e) {}
    };
})();
