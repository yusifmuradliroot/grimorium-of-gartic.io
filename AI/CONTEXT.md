# CONTEXT — infrastructure map

## Repos
- `abyss-of-gartic.io` (PRIVATE): raw source, protection layers DISABLED. All development happens here.
- `grimorium-of-gartic.io` (PUBLIC, this repo): protected output = abyss + protection (legal + code). branch `Aetherial`.

## Omni layout (`omni/`)
- `voyager/` — injector (loads the framework).
- `orbit/` — framework: WS Hub + API Engine + GUI + Loader.
- `plugins/` — plugins. Discovery chain:
  1. `index.json` → folder names (e.g. `["pixel_drawer"]`)
  2. `<plugin>/plugin.json` → id, name, description, entry file, mustContain, version
  3. `<plugin>/<entry>.js` → code, runs in VM with `unsafeWindow` passed in

## Key mechanisms (from old implementation, to be rebuilt)
- WS Hub patches `WebSocket`, exposes `sendWS` / `onWS` / `onWSSend`.
- API Engine parses Socket.IO packets (`40`/`41` session, `5` room info → mywsid/myid).
- Plugins MUST contain an omni-aware marker (`__omniWsHub`/`__omniHubReady` string)
  or the loader injects them into page context instead of the VM.
- Plugins MUST call `Orbit.verify(id)` first and abort on failure.
- User-facing branding is always "Omni" (no Voyager/Orbit names in GUI).

## Versions
See `docs/VERSIONING.md`. Omni = `voyager+orbit` (e.g. `1.0+1.1`).
