const NOTION_VERSION = "2026-03-11";
const CONTENT_DATA_SOURCE_ID = "873d46be-da30-4b4e-8960-1312ffe01d41";

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? "public, max-age=60, s-maxage=300" : "no-store",
      ...extraHeaders,
    },
  });
}

function textProp(prop) {
  if (!prop) return "";
  const parts = prop.rich_text || prop.title || [];
  return parts.map((part) => part.plain_text || "").join("").trim();
}

function selectProp(prop) {
  return prop?.select?.name || "";
}

function multiSelectProp(prop) {
  return (prop?.multi_select || []).map((item) => item.name);
}

function dateProp(prop) {
  return prop?.date?.start || "";
}

function urlProp(prop) {
  return prop?.url || "";
}

function mapPage(page) {
  const p = page.properties || {};
  return {
    id: page.id,
    title: textProp(p["Content / Campaign"]),
    type: selectProp(p["Content Type"]),
    slug: textProp(p.Slug),
    excerpt: textProp(p.Excerpt),
    body: textProp(p["Master Copy"]),
    pillar: textProp(p.Pillar),
    cta: textProp(p.CTA),
    channels: multiSelectProp(p.Channel),
    publishDate: dateProp(p["Publish Date"]),
    seoTitle: textProp(p["SEO Title"]),
    seoDescription: textProp(p["SEO Description"]),
    websitePath: textProp(p["Website Path"]),
    featuredImageUrl: urlProp(p["Featured Image URL"]),
    canonicalUrl: urlProp(p["Canonical URL"]),
    lastEditedTime: page.last_edited_time,
  };
}

async function notionQuery(env, filter) {
  if (!env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is not configured");
  }

  const response = await fetch(
    `https://api.notion.com/v1/data_sources/${CONTENT_DATA_SOURCE_ID}/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.NOTION_TOKEN}`,
        "notion-version": NOTION_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        filter,
        sorts: [{ property: "Publish Date", direction: "descending" }],
        page_size: 100,
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error(JSON.stringify({ event: "notion_query_failed", status: response.status, detail }));
    throw new Error(`Notion query failed: ${response.status}`);
  }

  return response.json();
}

function liveWebsiteFilter(extra = []) {
  const filters = [
    { property: "Status", select: { equals: "Live" } },
    { property: "Channel", multi_select: { contains: "Website" } },
    ...extra,
  ];
  return { and: filters };
}

async function listContent(request, env) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const extra = type ? [{ property: "Content Type", select: { equals: type } }] : [];
  const result = await notionQuery(env, liveWebsiteFilter(extra));
  const items = result.results.map(mapPage).filter((item) => item.slug && item.title);
  return json({ items, updatedAt: new Date().toISOString() });
}

async function getContentBySlug(env, slug) {
  const result = await notionQuery(
    env,
    liveWebsiteFilter([{ property: "Slug", rich_text: { equals: slug } }]),
  );
  const page = result.results[0];
  return page ? mapPage(page) : null;
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBody(value = "") {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("\n");
}

function articleHtml(item, indexingEnabled) {
  const title = item.seoTitle || item.title;
  const description = item.seoDescription || item.excerpt || "WAPAD knowledge article.";
  const robots = indexingEnabled ? "index,follow" : "noindex,nofollow";
  const canonical = item.canonicalUrl ? `<link rel="canonical" href="${escapeHtml(item.canonicalUrl)}">` : "";
  const image = item.featuredImageUrl
    ? `<figure class="cms-article__image"><img src="${escapeHtml(item.featuredImageUrl)}" alt="" loading="lazy"></figure>`
    : "";

  return `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${robots}">
  ${canonical}
  <title>${escapeHtml(title)} — WAPAD</title>
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/v2.css">
</head>
<body class="page-knowledge">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header site-header--solid"><div class="shell nav"><a class="brand" href="/index.html"><span class="brand__text"><strong>WAPAD</strong><small>Precious Asset Decision Desk</small></span></a><a class="nav-back" href="/knowledge.html">Knowledge Desk ↗</a></div></header>
  <main id="main">
    <article class="section section--cream cms-article"><div class="shell" style="max-width:860px">
      <span class="eyebrow eyebrow--gold">${escapeHtml(item.pillar || item.type || "Knowledge")}</span>
      <h1>${escapeHtml(item.title)}</h1>
      ${item.excerpt ? `<p class="lede">${escapeHtml(item.excerpt)}</p>` : ""}
      ${image}
      <div class="cms-article__body">${renderBody(item.body)}</div>
      ${item.cta ? `<div class="guide-card__callout"><strong>Next step</strong><span>${escapeHtml(item.cta)}</span></div>` : ""}
    </div></article>
  </main>
  <footer class="assessment-footer"><div class="shell"><span>WAPAD — Precious Asset Decision Desk</span><div><a href="/privacy.html">Privacy</a><a href="/sources.html">Sources</a><a href="/index.html">Main desk</a></div></div></footer>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/content") {
        return await listContent(request, env);
      }

      if (url.pathname.startsWith("/knowledge/") && url.pathname !== "/knowledge/") {
        const slug = decodeURIComponent(url.pathname.slice("/knowledge/".length).replace(/\/$/, ""));
        const item = await getContentBySlug(env, slug);
        if (!item) return new Response("Not found", { status: 404 });
        return new Response(articleHtml(item, env.WAPAD_INDEXING_ENABLED === "true"), {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=60, s-maxage=300",
          },
        });
      }
    } catch (error) {
      console.error(JSON.stringify({ event: "cms_connector_error", path: url.pathname, message: error.message }));
      if (url.pathname.startsWith("/api/")) {
        return json({ items: [], connectorReady: false }, 503);
      }
      if (url.pathname.startsWith("/knowledge/")) {
        return new Response("Knowledge article temporarily unavailable", { status: 503 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
