# RULES — hard rules for AI

1. **Version discipline.** Every script/plugin update MUST bump the version correctly:
   - Plugin → bump `version` in its own `plugin.json`. Never touch `@version` in the `.js` by hand (build syncs it).
   - Parts (`voyager`, `omni` framework) → each bumps its own version independently.
   - No derived version: omni IS the framework file. ("orbit" is retired.)
   - Forgetting a version bump is a defect. See `docs/VERSIONING.md`.
2. **abyss → grimorium flow.** Raw development happens in private `abyss`. This repo receives only protected output. Never weaken protection layers (`verify()`, `mustContain`, omni-aware markers).
3. **Small steps.** One decision, one change, one commit per agreed step. No unsolicited big refactors.
4. **No code without approval.** Discuss the plan first, write code only after user says so.
5. **Language.** User communication in Turkish. Code comments in English. Keep both short.
6. **No rambling.** Short, direct answers. No filler, no lectures, no repeating back what the user said.
   One decision per message. If a full explanation is needed, give the short version first and offer details.
7. **Verify.** Run builds / sanity checks after changes whenever possible. Report commit hashes after push.
8. **Link check.** After any change under `omni/`, run `python3 tools/check.py` once. Fix what it
    reports, re-run once. If still failing after 2 rounds, STOP and ask the user — no endless loops,
    no overthinking. A WARN is not a failure; proceed.
9. **Target environment: Firefox-based browsers + Violentmonkey.** All code MUST work there.
   No Chrome-only APIs. Check every `GM_*` / `unsafeWindow` usage against Violentmonkey behavior.
10. **No AI notes in shipped code.** `omni/voyager`, `omni/omni` and plugin files must contain
   zero AI-to-AI notes, AI TODOs, or session references. Exception: educational `example/`-style
   scripts may carry notes, but written for HUMANS learning the code. AI-to-AI memory belongs
   only in `AI/` files. (In private `abyss`, AI annotation is fully allowed.)
11. **PUBLIC repo — zero private data.** Everything in this repo (including `AI/` notes) is visible
    to everyone. NEVER write: tokens, passwords, emails, personal details, or anything identifying
    beyond the public GitHub handle. Functional context only (e.g. "mobile, no console"), no specifics.
12. **Prune against bloat.** Keep `AI/` files short and current: compress old detail, move stale
    entries out, delete dead files. Before any destructive cleanup, PROPOSE the list to the user
    and execute only after approval. Rule of thumb: if a file doesn't help the next AI continue
    work, it shouldn't exist.
13. **Context cues.** Short user sentences switch operating mode — record them in `WHEREWEARE.md`
    under "User context" and obey until changed. Never ask again for a recorded cue:
    - "konsol erişimim yok" → user is on mobile: diagnose via visual feedback only (badges, on-screen
      status). Never say "check the console".
    - "konsol erişimim var" → user is on desktop: console logs may be requested and used.
14. **Two-repo sync — only when needed.** Mirror to the other repo ONLY if the change affects the
    SHARED contract: layout, plugin schema, checker logic, or a rule/convention meant for both sides
    (adapt, don't blind-copy). NEVER copy repo-specific files across: this repo's LICENSE, TERMS,
    public docs stay here; abyss raw sources, dist output and private notes stay there.
    After a shared change, mirror in the same session and run `tools/check.py` on both.
15. **Sweep before close.** Before committing a version bump or closing a work block,
    glance over EVERY tracked file (`git ls-files`) for staleness against the change.
    Docs, README, CHANGELOG and WHEREWEARE must match the code.
