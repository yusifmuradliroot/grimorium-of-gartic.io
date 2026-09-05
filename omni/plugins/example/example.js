// example — REFERENCE plugin template, does nothing.
// Copy this folder to create a new plugin, then update plugin.json.
// __omniWsHub __omniHubReady — omni-aware marker, runs in VM (not page inject).

(function () {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ——— Orbit verify ———
    const Orbit = (w.Orbit && typeof w.Orbit.verify === 'function') ? w.Orbit : null;
    if (!Orbit) return;
    const token = Orbit.verify('example');
    if (!token || token.indexOf('example') === -1) return;

    if (w.__omniExample) return;
    w.__omniExample = true;

    console.log('[example] reference plugin loaded (does nothing)');
})();
