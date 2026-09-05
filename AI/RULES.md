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
6. **Verify.** Run builds / sanity checks after changes whenever possible. Report commit hashes after push.
