# WHEREWEARE — living state (AI: keep this updated)

## Goal
Rebuild `grimorium-of-gartic.io` from zero on branch `aetherial` as a strong
Gartic.io scripting platform (SDK vision). Description: "Scripting platform for Gartic.io".

## Done
- Repo cleaned, branch `main` deleted, `aetherial` is default.
- Settings: description, topics (gartic-io, userscript, tampermonkey, violentmonkey, firefox), custom LICENSE, issues open, no branch protection.
- Skeleton: `omni/{voyager,omni,plugins}`, `docs/`, plus README, .gitignore, CHANGELOG.
  ("orbit" retired — framework is `omni`, ships as `omni.fs`; voyager stays the only `.js`.)
- Docs: `VERSIONING.md` (plugin single version, core separate, omni derived `v+o`), `TERMS.md` (user agreement).
- Plugin system: `index.json` (folder names) + per-plugin folder (`plugin.json` + entry js). Reference `example/` template exists. Real pixel_drawer NOT public yet.
- Bug report template in `.github/ISSUE_TEMPLATE/`.
- Build mode: MANUAL (automation later).
- AI infra: AGENTS.md + AI/{RULES,WHEREWEARE,CONTEXT,LEARNINGS} with handoff, privacy,
  no-rambling, prune and context-cue rules. Target env rule: Firefox-based + Violentmonkey.
- Code cleanliness rule: no AI notes in shipped code (example/ scripts excepted, human-readable).

## User context
- Device: mobile, Firefox-based. Console: NONE → visual-feedback diagnosis only.

## Done (abyss side)
- Abyss reorganized: `omni/{voyager,omni,plugins,dist}` raw layout mirroring grimorium,
  dead files deleted (2.0M → 0.9M), own AGENTS.md + AI/ (full annotation allowed). Push `2c160f0`.
- Two-repo sync active: `tools/check.py` on both sides, rule 14 in both RULES.md.

## In progress
- (next AI: fill here)

## Next
- Fresh core code in `abyss` (raw voyager + omni framework, "Omni" branding everywhere).
- Protection build step abyss → grimorium (verify, mustContain, license headers).
- First real plugin publication.

## Open problems
- **mywsid capture saga (unresolved):** Orbit API Engine must own mywsid so it survives
  plugin reloads. `41` messages must NOT clear mywsid. Plugin must run in VM
  (omni-aware marker), not page-inject. See LEARNINGS.md.
