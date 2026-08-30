// Gartic Test Payload — executed via loader
// Shows green "working" badge if loader fetch & execute succeeds
(function () {
    'use strict';
    if (window.__garticTestPayloadLoaded) return;
    window.__garticTestPayloadLoaded = true;

    function showBadge() {
        if (!document.body) {
            setTimeout(showBadge, 300);
            return;
        }
        // avoid duplicates
        if (document.getElementById('gartic-test-working')) return;
        const el = document.createElement('div');
        el.id = 'gartic-test-working';
        el.textContent = 'working';
        el.style.cssText = [
            'position:fixed',
            'top:14px',
            'left:50%',
            'transform:translateX(-50%)',
            'z-index:2147483647',
            'padding:8px 18px',
            'background:#16a085',
            'color:#fff',
            'font:700 13px Arial,sans-serif',
            'border-radius:20px',
            'box-shadow:0 4px 14px rgba(0,0,0,.35)',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(el);
        console.log('[test-payload] working badge shown');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBadge);
    } else {
        showBadge();
    }
    // also try immediately for document-start
    showBadge();
})();
