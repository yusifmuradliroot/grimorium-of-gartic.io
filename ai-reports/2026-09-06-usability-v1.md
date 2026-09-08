# Usability + real-world readiness — would people use Omni?
Date: 2026-09-06 | chain: voyager 3.4 + omni 7.2 + 6 plugins | v1 (heuristic + virtual walkthrough, no live users yet)

## Verdict up front
A motivated tinkerer: YES. A casual player: NOT YET. Three gates block
adoption: no install guide, no auto-update, first-install blindness.
None is architectural; all are fixable in days.

## 1. Install journey (virtual walkthrough, mobile Firefox + Violentmonkey)
1. Find the repo → README describes structure, never says "install this file". FRICTION: HIGH (user must guess voyager.user.js).
2. Install voyager into manager → 1 tap, works. FRICTION: LOW.
3. Open gartic.io → agreement → plugin menu → checkboxes → Apply → receipt. Understandable, no account needed. FRICTION: LOW-MEDIUM (English-only UI; TR users — the actual audience — read a foreign menu).
4. First room join with fresh install → plugins blind until reload (socket predates tap). NOTHING tells the user. FRICTION: HIGH (looks broken; the fix exists but is undiscoverable).
Score: 2 smooth steps, 2 cliffs.

## 2. Update story (the worst gate)
- No `@updateURL`/`@downloadURL`: EVERY voyager release needs a manual reinstall
  by EVERY user. Nobody does this → version fragmentation → stale bug reports
  against fixed code. This alone caps the audience at enthusiasts.
- omni/plugins auto-update per page load (good design, zero user action).
- Fix cost: 1 header line + keeping the raw URL stable (it is). Do it first.

## 3. First run / onboarding
- Agreement screen: clear, one decision. Good.
- Plugin menu: names + versions + descriptions, dep auto-check with warning,
  Apply semantics, no-change guard. Good ( iterated with a real user).
- Receipt toast: green/red per plugin. Good — the only load feedback, keep it.
- Missing: "reload the room once after first install" hint (gate #4's fix),
  Turkish localization (audience mismatch, see §6).

## 4. Daily use (target stack)
- Pixel flow (pick → ETA → Start/Pause/Resume → done) is genuinely one-hand
  mobile usable. Progress + countdown remove the old "is it stuck?" anxiety.
- Silent running (no console needed) fits mobile. The red banner is the only
  console output — intentional, fine.
- Failure modes degrade to accurate status lines (waiting/blind/missed-join/
  ws-missing) instead of mystery. Good.
- Background-tab catch-up bursts keep long draws alive. Good.
- Thin spots: turn detection removed (fully manual — honest but less magic);
  anti-afk pulled (a whole use-case missing); scout needs rooms pages.

## 5. Trust (the invisible gate)
- Everything executable except voyager is an opaque `.fs` blob. Technical users
  can verify (format documented, runner readable), casual users cannot read
  what runs in their browser. Expect "is this a stealer?" questions.
- Mitigations available: keep abyss-free public differently? No — better:
  publish hashes + a verify-howto, keep the custom LICENSE visible in-menu
  (agreement already summarizes it — good), never request extra grants
  (header is already minimal: 1 grant — excellent).

## 6. Who uses it / who doesn't
- Uses: Gartic regulars who draw from photos, tampermonkey-literate, TR community
  (if localized), tolerance for manual updates.
- Doesn't (yet): casuals (install cliff), non-English readers (UI), anyone
  hitting first-install blindness (looks broken), Safari users (untested).

## Priority fixes (in order)
1. `@downloadURL` + install guide in README (with screenshots path).
2. First-install hint in menu ("reload the room once after Apply").
3. Turkish UI strings (or lang toggle; audience is TR-first).
4. Beta round with 3-5 real users before any announcement.
5. Reconsider turn-gate + anti-afk before calling it a platform (else it's "a pixel bot with extras" — fine positioning too, pick one story).
