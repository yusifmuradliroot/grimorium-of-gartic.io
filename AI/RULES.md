# RULES — hard rules for AI

1. **Version discipline.** Every script/plugin update MUST bump the version correctly:
   - Plugin → bump `version` in its own `plugin.json`. Never touch `@version` in the `.js` by hand (build syncs it).
   - Core parts (`voyager`, `orbit`) → each bumps its own version independently.
   - Omni version is derived (`voyager+orbit`), never counted separately.
   - Forgetting a version bump is a defect. See `docs/VERSIONING.md`.
2. **abyss → grimorium flow.** Raw development happens in private `abyss`. This repo receives only protected output. Never weaken protection layers (`verify()`, `mustContain`, omni-aware markers).
3. **Small steps.** One decision, one change, one commit per agreed step. No unsolicited big refactors.
4. **No code without approval.** Discuss the plan first, write code only after user says so.
5. **Language.** User communication in Turkish. Code comments in English. Keep both short.
5b. **No rambling.** Short, direct answers. No filler, no lectures, no repeating back what the user said.
   One decision per message. If a full explanation is needed, give the short version first and offer details.
6. **Verify.** Run builds / sanity checks after changes whenever possible. Report commit hashes after push.
7. **Target environment: Firefox-based browsers + Violentmonkey.** All code MUST work there.
   No Chrome-only APIs. Check every `GM_*` / `unsafeWindow` usage against Violentmonkey behavior.
8. **PUBLIC repo — zero private data.** Everything in this repo (including `AI/` notes) is visible
   to everyone. NEVER write: tokens, passwords, emails, personal details, or anything identifying
   beyond the public GitHub handle. Functional context only (e.g. "mobile, no console"), no specifics.
9. **Context cues.** Short user sentences switch operating mode — record them in `WHEREWEARE.md`
   under "User context" and obey until changed. Never ask again for a recorded cue:
   - "konsol erişimim yok" → user is on mobile: diagnose via visual feedback only (badges, on-screen
     status). Never say "check the console".
   - "konsol erişimim var" → user is on desktop: console logs may be requested and used.
