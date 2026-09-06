# Changelog

All notable changes to this project are recorded here.
Versions: `voyager` and `omni` (framework, ex-orbit) version independently;
plugins carry their own version.

## [Unreleased]

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
