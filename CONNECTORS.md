# WAPAD Connector Contract

This repository consumes website content from the **WAPAD — Content & Marketing** Notion data source.

## Source of truth

- Notion: copy, SEO metadata, slug, channel and publication status.
- pCloud: canonical binary assets and approved source files.
- GitHub/Cloudflare: website code and delivery only.

## Notion CMS

Data source ID:

`873d46be-da30-4b4e-8960-1312ffe01d41`

The Worker returns content only when both are true:

- `Status = Live`
- `Channel` contains `Website`

Everything else stays private from the website.

### Endpoints

- `GET /api/content`
- `GET /api/content?type=Article`
- `GET /knowledge/{slug}`
- `/knowledge.html` is the static Knowledge Desk enhanced with live Notion article cards.

## Required Cloudflare secret

The Worker needs a Notion internal-integration token stored as the Cloudflare Worker secret:

`NOTION_TOKEN`

Never commit this token to GitHub or `wrangler.jsonc`.

The Notion integration must have read-content access and the **WAPAD — Content & Marketing** database must be shared with that integration.

## Indexing gate

`WAPAD_INDEXING_ENABLED` is intentionally `false` in `wrangler.jsonc`.

Keep it false until the production domain and content QA are approved. When set to `true`, server-rendered Notion articles may return `index,follow` instead of `noindex,nofollow`.

## Failure behaviour

If the Notion credential is missing or Notion is unavailable:

- static WAPAD pages continue to work;
- `/api/content` fails closed and returns no private content;
- dynamic article routes return a temporary-unavailable response;
- the existing static Knowledge Desk remains the fallback.

## Publishing workflow

`Inbox → Briefed → Producing → Review → Approved → Scheduled → Live → Measured → Closed`

Moving a record to **Live** is the publication gate. Do not build another catalogue or CMS beside this one.
