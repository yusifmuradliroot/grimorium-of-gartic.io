# grimorium-of-gartic.io

Scripting platform for Gartic.io — Omni core and plugins.

## Structure

```
omni/
  voyager/   → the only .js: loader + embedded runner (forged output)
  omni/      → omni.fs: signed framework build (Hub + API + GUI + Loader)
  plugins/   → shipped .fs plugins, each in its own folder (index.json + plugin.json)
docs/        → setup, architecture, plugin guide
```

## License

Custom source-available license — see [LICENSE](LICENSE).
Reading for learning is allowed. Public redistribution is not.
