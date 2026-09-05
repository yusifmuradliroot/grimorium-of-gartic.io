# Versioning rules

- Plugins: single version, stored in the plugin's own `plugin.json` (`version`).
  The `@version` header inside the plugin `.js` is synced from it at build time.
- Parts are independent, each carries its own version:
  - `voyager` → own version (loader + embedded runner host, the only `.js`)
  - `omni` → own version (framework, ex-orbit; ships as `omni.fs`)
- No derived version anymore: "Omni" is the framework file itself, not a sum.
  ("orbit" is retired — anything orbit was, is omni now.)
