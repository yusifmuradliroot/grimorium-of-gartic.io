# Changelog

All notable changes to this project are recorded here.
Versions: `voyager` and `omni` (framework, ex-orbit) version independently;
plugins carry their own version.

## [Unreleased]
- omni 5.0: clean recode (Hub + API + GUI + Loader). .fs-only, own-runner
  fallback, index-validated stored selection, receipt toast, Reset Omni.
  Fixes a latent NativeWS(url, undefined) proto bug.
- forge 2.7.1 rebuild: embedded runner keeps its global name (short had
  renamed it, breaking every .fs plugin load). Full chain re-verified.
- ROLLBACK to last-known-good (load failures Direncli): voyager 2.3 + omni 4.0 +
  ws_core 1.2 + pixel_drawer 2.3 (8x8, 2-2-2 bit, 250ms). Effort split, turn gate,
  ws raw parser and newer features STAY IN ABYSS LAB until the exec cause is found.
  Silence kept: rebuilt with forge nolog + red banner. Public pins old logic.
- omni 4.1: visible load receipt (toast shows per-plugin loaded/fetch/exec/dep status).
- Silent public: forge nolog strips all console.* (keep-log banner survives).
  Only output: big red startup banner. Voyager fully silent.
- voyager 2.4: fetch-only download (GM_xhr grants dropped, header minimal),
  FS:2-only gate (legacy unsigned FS:1 refused at the door).
- voyager 2.5: carries forge runner v3 (FS:1 reader removed; last reader in forge archive).

## Releases
- omni 4.0 + voyager 2.x: embedded forgescript runner, `.fs` era (FS:2 signed).
  Public set: voyager.user.js + omni.fs + pixel_drawer.fs + ws_core.fs.
  (anti_afk pulled: live-object finder failed on mobile, back to abyss lab.)
- effort_engine 1.0 (new) + pixel_drawer 3.0: render split — engine quantizes 3-3-3 bit,
  auto-picks grid 16–32 by 100s budget; sender is turn-gated (faded until E16/E17-ours),
  200ms/packet, follows omni theme.
- pixel_drawer 3.1: E17 no longer clobbers E16 state when identity unknown + turn logs.
- check.py: signature order fixed to runner order (was inverse; false FAIL on [2,0,1]).
- effort_engine 1.1: color-first — quantize once at 32x32, smaller grids derived
  by nearest sample (no re-averaging, details keep their colors).
- effort_engine 2.0 + pixel_drawer 3.5: backported v3 quality — flood background
  (inverse-dominant + [7,0,0], cells skipped), merged rectangles (right+down),
  aspect-aware ladder 16–48, full-res source + bit-shift snap.
- omni 2.x–3.x: dependency resolution, theme bus, roster core, settings panel.
- voyager 1.x: self-check + fail-closed blocker, single GM_info version source.
- mywsid saga resolved via tolerant direct extract (see abyss LEARNINGS).
