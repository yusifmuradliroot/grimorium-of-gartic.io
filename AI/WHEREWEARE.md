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
- (next AI: fill here)

## Next
- verify live boot of the .fs chain in a real room
- republish further plugins (from abyss) on order

## Open problems
- (none open — mywsid saga RESOLVED via tolerant direct extract; see abyss LEARNINGS)
