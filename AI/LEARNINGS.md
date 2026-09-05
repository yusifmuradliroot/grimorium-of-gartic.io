# LEARNINGS — AI memory (AI: append here, never delete)

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
