# Versioning rules

- Plugins: single version, stored in the plugin's own `plugin.json` (`version`).
  The `@version` header inside the plugin `.js` is synced from it at build time.
- Core parts are independent, each carries its own version:
  - `voyager` → own version
  - `orbit` → own version
- Omni itself has its own internal version on top of the parts.
