# CONTEXT — infrastructure map

## Environment
Firefox-based browsers + Violentmonkey. Everything is developed and tested against this stack.

## Repos
- `abyss-of-gartic.io` (PRIVATE, local `/tmp/abyss`): raw source, protection layers
  DISABLED. All development happens here.
- `grimorium-of-gartic.io` (PUBLIC, this repo, local `/root/grimorium-of-gartic.io`):
  built output = abyss sources via forge (strip, short, crypt; pack for `.fs`).
  branch `aetherial`. Raw JS never lands here.
- Build bible lives in abyss: `docs/BUILD.md` (exact commands, dual-dev procedure).

## Omni layout (`omni/`)
- `voyager/` — the ONLY `.js`: loader + embedded forgescript runner (forged output).
  Self-checks its version, shows blocker when outdated, boots `omni.fs`.
- `omni/` — `omni.fs` (signed FS:2 build of the framework: Hub + API + GUI + Loader).
- `plugins/` — shipped plugins as `.fs` (signed). Discovery chain:
  1. `index.json` → folder names
  2. `<plugin>/plugin.json` → id, name, description, entry (.fs), mustContain, version, dependencies
  3. `<plugin>/<entry>.fs` → executed by the embedded runner (no VM, no page inject)

## Key mechanisms (LIVE)
- WS Hub patches `WebSocket`, exposes `sendWS` / `onWS` / `onWSSend`.
- Kernel owns mywsid; E5 parsed by tolerant direct extract (`42["5",myid,mywsid,...`);
  `41` never clears identity. Roster from best-effort full parse + 23/24 deltas.
- Loader resolves `dependencies` (topo order, auto-pull, fail blocks dependents),
  executes `.js` in VM / `.fs` via runner.
- Plugins MUST call `Orbit.verify(id)` first and abort on failure.
- User-facing branding is always "Omni".

## Versions
See `docs/VERSIONING.md`. No derived version: voyager and omni version independently.
