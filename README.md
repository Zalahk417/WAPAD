# WAPAD — WA Precious Asset Desk

Production website and controlled-pilot web application for **WA Precious Asset Desk (WAPAD)**.

## Current deployment

- Source: GitHub (`main`)
- Hosting: Cloudflare Workers Static Assets
- Deployment: Cloudflare Git integration / Wrangler
- Temporary URL: `https://wapad.pmhaik.workers.dev`
- Production domain: pending

Any push to `main` triggers a Cloudflare deployment.

## WAPAD v2

The v2 web product includes:

- Premium responsive public desk experience
- Asset-specific pathways for jewellery, watches, bullion, gemstones and estate parcels
- Evidence-led method and route explanation
- Browser-local private pre-assessment wizard
- Local draft save / resume
- Local photo preview (photos are not uploaded)
- Preparation-route logic
- Printable / copyable assessment brief
- Searchable knowledge desk
- Offline-capable core pages through a small service worker
- Conservative controlled-pilot readiness status

## Deliberate launch boundary

The website must not imply that WAPAD is already providing regulated or custody services before the required operating controls are complete.

The current pre-assessment is **information and preparation only**. It does not:

- authenticate an item
- perform a trade measurement
- calculate a live valuation or purchase offer
- create a transaction
- upload evidence to WAPAD
- accept custody or payment

Secure intake, production email, appointment booking, D1/R2-backed cases, authentication, payments and admin workflows are backend launch steps and should only be enabled after the associated privacy, licensing, custody, security and operational controls are approved.

See `LAUNCH_CHECKLIST.md` for the operating gate.
