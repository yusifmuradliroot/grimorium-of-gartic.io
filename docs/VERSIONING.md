# Versioning rules

- Plugins: single version, stored in the plugin's own `plugin.json` (`version`).
  The `@version` header inside the plugin `.js` is synced from it at build time.
- Core parts are independent, each carries its own version:
  - `voyager` → own version
  - `orbit` → own version
- Omni's internal version is derived from the parts, not counted separately:
  `voyager+orbit` side by side (e.g. voyager 1.0 + orbit 1.1 → Omni `1.0+1.1`).
