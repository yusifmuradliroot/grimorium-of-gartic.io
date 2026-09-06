# LEARNINGS — AI memory (AI: append here, never delete)

## Conventions (taste-level, don't churn these)
- Branch names lowercase (`aetherial`, `chaotic`). Never rename for style alone.
- When user bikesheds on details: give one honest short opinion, don't manufacture churn for zero gain.

## 2026-09-05 — infra-building session with user
- User wants micro-steps: one decision per message, short answers, approval before each move.
  Long briefings get rejected ("daha kisa-kisa"). When user says "anlamadim", re-explain with a
  concrete example, not more abstraction.
- User decides fast ("ekle", "yaz", "evet", "devam"). Don't slow down with extra questions
  after approval — execute immediately.
- Strategic calls stay with the user (license type, version scheme, directory layout). Propose
  2-3 options max, recommend one, let them pick.

## 2026-09-05 — mywsid saga
- `setSession(false)` on Socket.IO `41` was clearing mywsid → plugins lost identity on every reconnect.
  FIX: preserve mywsid on `41`; only the next `5` packet overwrites it. mywsid must be owned by the
  Orbit kernel, never by individual plugins, so it survives plugin reloads.
- Lesson: session state (open/closed) and identity (mywsid) are different things. Never clear identity on session close.

## 2026-09-05 — VM vs page-inject
- Loader page-injects any plugin containing `unsafeWindow`/`WebSocket` UNLESS it contains an
  omni-aware marker string (`__omniWsHub`/`__omniHubReady`). Page-injected plugins lose Tampermonkey
  APIs and get a broken `Orbit` reference.
- FIX: every plugin must include the marker comment so it runs in the VM where `unsafeWindow` is passed correctly.
- Lesson: when a plugin "can't reach the API", check WHERE it executes before debugging the API itself.

## 2026-09-05 — Hub addEventListener double-push
- The `addEventListener('message')` override was pushing callbacks into `listeners` AND the
  instance already had a dispatching handler → messages processed multiple times, risk of recursion
  with the `onmessage` wrapper.
- FIX: override only ensures patching, never pushes to `listeners`.
- Lesson: interception layers must have exactly one dispatch path.

## 2026-09-05 — manifest evolution
- Started with hardcoded PLUGINS array → moved to central `manifest.json` → moved to per-plugin
  folders (`index.json` names + `<plugin>/plugin.json` metadata). Reason: static hosts can't list
  directories, but plugin updates should touch only that plugin's folder.
- Lesson: user prefers decentralized metadata; keep central files to dumb name lists.

## 2026-09-05 — mobile debugging
- User tests on mobile Firefox-based browser, no console access. All diagnosis needs visual feedback
  (debug badges, on-screen status). Never rely on "check the console".

## 2026-09-06 — anti_afk 6.0 (room.js AFK chain, verified from reference chunks)
- Idle over 150s (`_timerAtivo` 1s tick) emits `avisoInativo` → React ALERT popup
  (OK = close + `active()`). `active()` = socket emit 42 + room code → wire `42[42,"CODE"]`.
  Server packet 32 = inactivity notice (`inativo` event).
- Plugin simulates the game's OWN ping every 30s (5x margin) → popup never fires.
  Recovery ping if 32 arrives anyway. No scribble/vote extras (5.0 Kawaii-mirror retired).
- `.fs` builds lose the `__omniWsHub` marker comment (strip pass) — expected, matches
  pixel_drawer/ws_core precedent. mustContain uses a code identifier (`__antiAfk`), never a comment.

## 2026-09-06 — anti_afk 6.0 FAILED live, 7.0 fixes it
- 6.0 sent only wire `42[42,"CODE"]`. Popup still appeared → kick. Root cause: the
  popup is CLIENT-side (`_timerAtivo` vs local `_ativo`); wire packets never reset it.
  The working standalone grabs the live game object (React fiber) and calls `active()`.
- 7.0 does the same from inside the plugin (DOM via unsafeWindow, fiber walk capped at
  400 nodes): `game._ativo = now + game.active()` every 30s; wire ping only as fallback
  until the object is found. Lesson: simulate the game's METHOD, not just its packets.
- 7.0 ALSO failed live → pulled from public. Finder likely misses on mobile layout
  (different selectors/fiber shape). Raw stays in abyss for lab work; do NOT republish
  without a live mobile verification first.

## 2026-09-06 — pixel split (effort_engine 1.0 + pixel_drawer 3.0)
- Engine owns ALL compute (raster, 3-3-3 quantize, grid pick, queue); sender owns UI +
  turn gate + timing. Shared via `w.Effort`, wired as loader `dependencies`.
- Grid auto-pick: first of 32/28/24/20/16 with packets×0.2s ≤ 100s (tempoRodada per docs);
  16x16 returned even if over budget. Turn = E16 or E17-with-our-id; end = E19/E17-other.

## 2026-09-06 — checker sig bug (caught by pixel 3.1 build)
- `check_packed` rebuilt segments with the INVERSE permutation (`blobs[o.index(e)]`);
  runner uses `B[o[i]]` order. Only self-inverse orders (e.g. [0,2,1]) passed both.
  Pack emitted [2,0,1] → false FAIL on a runner-valid file. Fixed to runner order
  in BOTH repos (shared contract, rule 14). Lesson: verify tooling against the runner,
  not against files that happen to pass.
