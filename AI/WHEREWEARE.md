# WHEREWEARE — living state (AI: keep this updated)

## Goal
Rebuild `grimorium-of-gartic.io` from zero on branch `Aetherial` as a strong
Gartic.io scripting platform (SDK vision). Description: "Scripting platform for Gartic.io".

## Done
- Repo cleaned, branch `main` deleted, `Aetherial` is default.
- Settings: description, topics (gartic-io, userscript, tampermonkey, violentmonkey, firefox), custom LICENSE, issues open, no branch protection.
- Skeleton: `omni/{voyager,orbit,plugins}`, `docs/`, plus README, .gitignore, CHANGELOG.
- Docs: `VERSIONING.md` (plugin single version, core separate, omni derived `v+o`), `TERMS.md` (user agreement).
- Plugin system: `index.json` (folder names) + per-plugin folder (`plugin.json` + entry js). Reference `example/` template exists. Real pixel_drawer NOT public yet.
- Bug report template in `.github/ISSUE_TEMPLATE/`.
- Build mode: MANUAL (automation later).
- AI infra: AGENTS.md + AI/{RULES,WHEREWEARE,CONTEXT,LEARNINGS} with handoff, privacy,
  no-rambling, prune and context-cue rules. Target env rule: Firefox-based + Violentmonkey.
- Code cleanliness rule: no AI notes in shipped code (example/ scripts excepted, human-readable).

## User context
- Device: mobile, Firefox-based. Console: NONE → visual-feedback diagnosis only.

## In progress
- Abyss organization (AI infra mirror + source layout + cleanup).

## Next
- Fresh core code in `abyss` (raw voyager + orbit, single "Omni" branding in GUI).
- Protection build step abyss → grimorium (verify, mustContain, license headers).
- First real plugin publication.

## Open problems
- **mywsid capture saga (unresolved):** Orbit API Engine must own mywsid so it survives
  plugin reloads. `41` messages must NOT clear mywsid. Plugin must run in VM
  (omni-aware marker), not page-inject. See LEARNINGS.md.
