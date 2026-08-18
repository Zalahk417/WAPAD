# WAPAD — Precious Asset Decision Desk

Production website and controlled-pilot application for **WAPAD**, founded in Western Australia and redesigned as a location-light precious-asset decision desk.

## Current deployment

- Source: GitHub (`main`)
- Hosting: Cloudflare Workers Static Assets
- Deployment: Cloudflare Git integration / Wrangler
- Temporary URL: `https://wapad.pmhaik.workers.dev`
- Production domain: pending

Any push to `main` triggers a Cloudflare deployment.

## Customer product ladder — v5

WAPAD now has an explicit customer-facing commercial ladder:

1. **Free Route Check — A$0 / available now**
   - Browser-local first-pass evidence capture and routing.
   - No authentication, valuation, purchase offer or custody.
2. **Decision Brief — A$49 pilot price / paid pilot product**
   - One asset.
   - Human review of the Route Check, route research, useful comparable-market context, evidence gaps, confidence notes and a written next-step recommendation.
   - Not a registered valuation or authentication certificate.
3. **Estate Triage — A$249 pilot price / paid pilot product**
   - Mixed collections, pilot scope up to 20 items.
   - Priority map, preservation/grouping flags, evidence gaps and specialist triggers.
   - Not a bundle of formal valuations.
4. **External specialist escalation — provider fee**
   - Registered valuer, gemmologist, watchmaker, laboratory, auction house or other specialist when the unanswered question requires physical or credentialled work.
   - Third-party fees sit outside WAPAD's pilot pricing.

Checkout remains disabled until secure intake, payment, privacy and delivery workflows are production-ready. The A$49 and A$249 prices are deliberately visible now so the product, positioning and economics can be tested before launch.

## WAPAD strategy

WAPAD is not positioned as an uncredentialled buyer/valuer. The core product is **decision intelligence before transaction**: capture evidence, compare likely routes, keep uncertainty visible and escalate to the right credentialled specialist only when value-at-risk justifies it.

The commercial model is designed to be asset-light and portable. The long-term moat is the workflow, case/outcome data, routing rules, specialist network and trust architecture — not inventory ownership or dependence on one AI model.

## Product experience

The customer front end includes:

- Persistent Route Check and Ask WAPAD actions
- Scroll-triggered reveals, staggered cards, parallax elements and animated route flow
- Interactive route examples for estates, watches, jewellery and bullion
- Free browser-local six-step Route Check with local photo previews
- Paid-service recommendation after the completed Route Check
- Dedicated Services & Pilot Pricing page
- Local draft save/resume and printable/copyable evidence brief
- Searchable Knowledge Desk
- Offline-capable core pages
- Conservative controlled-pilot boundaries throughout

## Deliberate launch boundary

The website must not imply that WAPAD is already providing regulated, formal valuation, authentication, custody or transaction services before the required controls and partners are in place.

The current Route Check is **information and preparation only**. It does not authenticate an item, perform trade measurement, create a formal valuation, calculate a purchase offer, upload customer evidence, create a transaction, accept custody or take payment.

Secure intake, production email, backend case storage, payments, partner workflows and any regulated dealing remain later launch steps and must only be enabled after the associated privacy, licensing, custody, security and operational controls are approved.

See `LAUNCH_CHECKLIST.md` for the operating gate.
