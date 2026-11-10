# ChchWeekly Archive — Cloudflare Pages starter

This is a lightweight, SEO-friendly companion site for **chchweekly.co.nz**. It does **not** replace your existing MailerLite homepage or subscriber forms.

- Main website: `https://www.chchweekly.co.nz/` (MailerLite)
- Archive: `https://read.chchweekly.co.nz/` (Cloudflare Pages)
- Latest issue: `/latest/` (full rendered HTML; canonical URL points to dated edition)
- Every issue: `/editions/YYYY-MM-DD/` (permanent, indexable)
- Past issues: `/editions/`
- Automatic sitemap: `/sitemap.xml`, and crawler file `/robots.txt`
- RSS feed: `/feed.xml`

## Publish your first edition

1. Open `editions/2026-11-12.html`. Its first HTML comment is the metadata for the edition.
2. Replace the example event descriptions and section text with the **real** edition content. It can be HTML taken from your newsletter, but remove email-only markup, unsubscribe links, tracking scripts and broken image URLs. Keep clean descriptive headings and links.
3. Set `"draft": false` in the metadata comment. This is essential: drafts don't appear online or in the sitemap. **Do not publish placeholder text.**
4. Save the file. Next week, create `editions/2026-11-19.html` with the new date, title, description and content. Keep the old edition file; it stays searchable indefinitely. There is no need to edit any other file.
5. Run `npm run build` locally (requires Node.js 18+). It creates a deploy-ready `dist/` directory, but with GitHub-connected Cloudflare Pages it builds automatically.

## Put it online

1. Create a GitHub repository (e.g. `chchweekly-archive`) and upload all files/folders **except** `dist/`.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → connect the GitHub repository.
3. Build command: `npm run build`. Output directory: `dist`. Production branch: `main`.
4. Cloudflare will first give you a `*.pages.dev` URL for testing. Check the design and your content there.
5. Cloudflare Pages project → Custom domains → add `read.chchweekly.co.nz`. Follow Cloudflare's DNS instructions to create/confirm the subdomain CNAME. **Do not change the MailerLite DNS records for the root domain.**
6. In your main MailerLite website navigation, add a link labelled **Latest edition** to `https://read.chchweekly.co.nz/latest/`. To preserve your original `/latest` shortcut, change its existing redirect target to this new address. The indexable, canonical pages live on `read.chchweekly.co.nz/editions/...`.
7. In Google Search Console, add/verify the archive property and submit `https://read.chchweekly.co.nz/sitemap.xml`. Indexing is not automatic or guaranteed.

## Your weekly routine

1. Finalise newsletter for Thursday.
2. Use ChatGPT to convert that edition into simple web HTML with `h2` headings for sections, `h3` for named events, descriptive summaries and working links.
3. Create one dated HTML file in `editions/`, with the metadata JSON comment at the top.
4. Commit the file on GitHub (browser upload/edit works). Cloudflare deploys automatically. `/latest/` points to the newest date.

## Content & SEO tips

- Include original, useful event descriptions and sources, not just images or an embedded email iframe.
- Use proper venue/date/time details where known; do not invent them.
- For each edition, keep an accurate page title and description in the JSON comment.
- Do not remove old editions, because those are your permanent search pages.
- Source permission still matters for any photos you publish.
- `/latest/` displays a full HTML copy of the newest issue but has a **canonical tag** pointing to its dated URL, to reduce duplicate-content problems. The dated URL is the one we'd aim to get indexed.
- As old event listings become outdated, consider adding a small 'Archive edition' notice, which can be implemented later.

## Technical details

The site has no third-party dependencies, no database, no runtime JavaScript, and no paid build services. It needs Node.js only to build. HTML pages are built ahead of time, including metadata and schema.org `BlogPosting` structured data. The one draft sample is excluded from the live pages and sitemap until you edit it.

**Important:** The example issue is a draft. Until you replace it with actual content and set `draft` to `false`, the archive displays an 'almost ready' placeholder and advertises no indexable issues. This is deliberate to prevent test content being published as fact.
