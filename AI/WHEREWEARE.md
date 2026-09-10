# WHEREWEARE — living state (AI: keep this updated)

## Goal
`grimorium-of-gartic.io` (PUBLIC, branch `aetherial`) is the protected distribution
of the Gartic.io scripting platform (SDK vision). Raw source lives in private abyss;
this repo receives built output. Export is MANUAL.

## Done
- Repo rebuilt from zero: description, topics, custom LICENSE, issues open, no protection.
- Skeleton: `omni/{voyager,omni,plugins}`, `docs/`, README, .gitignore, CHANGELOG.
- Docs: `VERSIONING.md` (parts version independently, plugins single version),
  `TERMS.md` (user agreement, English).
- AI infra: AGENTS.md + AI/ (17 rules), bug template, link checker (`tools/check.py`
  validates .js entries and signed `.fs` entries).
- Production chain LIVE: voyager 3.1 (forged, embedded runner, internal version check)
  boots `omni.fs` 5.0 (FS:2 signed, forge-built, own-runner fallback). Only `.js` in the chain.
- Current public set: voyager 3.1 + omni.fs 5.0 (clean recode) +
  pixel_drawer.fs 2.4 + ws_core.fs 1.2 + example.fs 1.0.
  (Rollback era over: exec root cause was the renamed runner, fixed forge 2.7.1.
  New line still in abyss lab. Silence kept: nolog + banner.)
  (anti_afk PULLED from public — both 6.0 and 7.0 failed live; raw stays in abyss.)
  (Older public plugins were removed; abyss keeps all sources.)

## User context
- Device: mobile, Firefox-based. Console: AVAILABLE for now (past logs received).
  Diagnose via console when present, badge otherwise.

## In progress
- NEW PUBLIC PLUGIN nick_free 1.1 (forge 2.11.1, decrypt==dev + marker +
  forged-behavior OK): removes both nickname gates. Awaiting user live
  test with /' + bold-unicode names.
- NEW PUBLIC PLUGINS cooldown_killer 1.0 + vote_free 1.0 (forge 2.11.1,
  decrypt==dev + markers OK): 15s hop wait removed, 60s votekick removed
  + autovote follower (never self/own). Awaiting user live test.
- vote_free 1.1 (public): cooldown still reported live -> diagnosis slot
  (__voteFreeStatus) + wider fiber landmarks. Awaiting status paste.
- vote_free 1.2 (public): retaliation vs voters targeting me (120s
  throttle, owner skipped). Awaiting live test.
- NEW PUBLIC PLUGIN rejoin 1.0 (forge 2.11.1, decrypt==dev + marker OK,
  deps ws_core): auto-return after kick (1/9). Awaiting user live test.
- rejoin 1.1 (public): reported dead -> diagnosis slot. Awaiting
  JSON.stringify(window.__rejoinStatus) paste.
- NEW PUBLIC PLUGIN text_draw 1.0 (forge 2.11.1, decrypt==dev + marker +
  forged-behavior OK, deps ws_core): vector text writer. Awaiting live test.
- text_draw 1.1 (public): auto-fit + word batching. Awaiting live test
  (batch render + auto-shrink).
- text_draw 1.2 (public): overflow approval (warn + second-Draw confirm).
  Awaiting live test.
- text_draw 1.3 (public): wire back to arrays (strings dropped live).
  Awaiting live test (drawing should return).
- text_draw 1.4 (public): v1.0 pacing restored (1.3 speed kicked live).
  Awaiting live test.
- text_draw 1.5 + NEW quiz_host 1.0 (public, decrypt==dev + markers OK):
  date-quiz master. Awaiting live test (needs year theme room).
- Rebuilt all with forge 2.11.1 (voyager 3.4 slot 0752595b, omni 7.2, 6 plugins).
  Decrypt==dev + markers + syntax verified per file. No source changes.
- 2026-09-08 noforge outage fixed: omni.fs now carries its own runner again
  (embedded runner proven identical to original on ws_core.fs).

## Next
- verify live boot of the .fs chain in a real room
- republish further plugins (from abyss) on order

## Open problems
- (none open — mywsid saga RESOLVED via tolerant direct extract; see abyss LEARNINGS)
