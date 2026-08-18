# WAPAD — Precious Asset Decision Desk

Production website and controlled-pilot application for **WAPAD**, founded in Western Australia and redesigned as a location-light precious-asset decision desk.

## Current deployment

- Source: GitHub (`main`)
- Hosting: Cloudflare Workers Static Assets
- Deployment: Cloudflare Git integration / Wrangler
- Temporary URL: `https://wapad.pmhaik.workers.dev`
- Production domain: pending

Any push to `main` triggers a Cloudflare deployment.

## WAPAD v3 strategy

WAPAD is no longer positioned as an uncredentialled buyer/valuer. The core product is **decision intelligence before transaction**: capture evidence, compare likely routes, keep uncertainty visible and escalate to the right credentialled specialist only when value-at-risk justifies it.

The commercial model is designed to be asset-light and portable:

- Free browser-local Route Check as the lead and qualification layer
- Planned paid Decision Brief for market-route research, evidence gaps and next-step logic
- Planned remote Estate Triage for mixed collections
- Planned B2B Partner Desk for white-label intake and case qualification
- Specialist/valuer/auction/buyer network used selectively rather than pretending WAPAD can personally authenticate every category

The long-term moat is the workflow, case/outcome data, routing rules, specialist network and trust architecture — not inventory ownership or dependence on one AI model.

## Product experience

The current v3 front end includes:

- Scroll-triggered reveals, staggered service cards, parallax elements and animated route flow
- Interactive route examples for estates, watches, jewellery and bullion
- Location-independent operating-model visualisation
- Browser-local six-step Route Check with local photo previews
- Local draft save/resume and printable/copyable evidence brief
- Searchable Knowledge Desk
- Offline-capable core pages
- Conservative controlled-pilot boundaries throughout

## Deliberate launch boundary

The website must not imply that WAPAD is already providing regulated, formal valuation, authentication, custody or transaction services before the required controls and partners are in place.

The current Route Check is **information and preparation only**. It does not authenticate an item, perform trade measurement, create a formal valuation, calculate a purchase offer, upload customer evidence, create a transaction, accept custody or take payment.

Secure intake, production email, backend case storage, payments, partner workflows and any regulated dealing remain later launch steps and must only be enabled after the associated privacy, licensing, custody, security and operational controls are approved.

See `LAUNCH_CHECKLIST.md` for the operating gate.
