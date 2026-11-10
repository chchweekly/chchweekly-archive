import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const source = path.join(root, 'editions');
const DOMAIN = 'https://read.chchweekly.co.nz';
const MAIN = 'https://www.chchweekly.co.nz';
const escapeHTML = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const xml = escapeHTML;
const slugDate = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(+d)) throw new Error(`Invalid date: ${iso}`);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};
const shortDate = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-NZ', {day:'numeric', month:'short', year:'numeric', timeZone:'UTC'});
};
const write = (relative, body) => {
  const dest = path.join(out, relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, 'utf8');
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, {recursive: true});

const editions = fs.readdirSync(source).filter(f => f.endsWith('.html')).map(f => {
  const raw = fs.readFileSync(path.join(source, f), 'utf8');
  const match = raw.match(/^\s*<!--\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!match) throw new Error(`Missing JSON metadata comment at beginning of ${f}`);
  const data = JSON.parse(match[1]);
  for (const field of ['title','description','date']) if (!data[field]) throw new Error(`Missing ${field} in ${f}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`Invalid ISO date in ${f}`);
  if (f !== `${data.date}.html`) throw new Error(`${f}: filename must match date (${data.date}.html)`);
  return {...data, html:raw.slice(match[0].length), slug:data.date};
}).filter(e => !e.draft).sort((a,b) => b.date.localeCompare(a.date));

const css = `
:root{--ink:#23392c;--green:#335a43;--sage:#dfe9de;--paper:#fbfaf6;--white:#fff;--muted:#647368;--rule:#e2e7df;--soft:#f0f4ed}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;line-height:1.6;font-size:16px}
a{color:var(--green)}a:hover{text-decoration-color:var(--green)}.container{width:min(100% - 40px,850px);margin-inline:auto}
.site-header{background:var(--white);border-bottom:1px solid var(--rule)}.topbar{min-height:78px;display:flex;justify-content:space-between;align-items:center;gap:22px}
.brand{text-decoration:none;display:flex;align-items:center;gap:8px;color:var(--ink);letter-spacing:-.8px;font-size:22px;font-weight:800;white-space:nowrap}.brand-mark{height:26px;width:26px;border-radius:50%;background:var(--green);display:grid;place-items:center;color:#fff;font-size:15px}
nav{display:flex;align-items:center;gap:23px}nav a{text-decoration:none;color:var(--ink);font-size:14px;font-weight:600}nav a:hover{text-decoration:underline}
.hero{padding:58px 0 40px}.eyebrow{text-transform:uppercase;letter-spacing:2px;font-size:11px;color:var(--green);font-weight:800;margin:0 0 13px}h1,h2,h3{font-family:Georgia,'Times New Roman',serif;letter-spacing:-.035em;line-height:1.18}h1{font-size:clamp(37px,6vw,57px);margin:0 0 18px}h2{font-size:clamp(26px,3vw,32px);margin:36px 0 14px}h3{font-size:22px;margin:30px 0 8px}.subhead{font-size:18px;color:var(--muted);max-width:690px;margin:0 0 24px}.meta{font-size:13px;color:var(--muted);margin-bottom:24px}
.card{background:var(--white);border:1px solid var(--rule);border-radius:14px;padding:25px 28px;box-shadow:0 2px 14px rgba(35,57,44,.025)}.card h2{font-size:26px;margin:7px 0 12px}.card p{color:var(--muted);margin:0 0 14px}.card .meta{margin:0}.card a.title-link{text-decoration:none;color:var(--ink)}.card a.title-link:hover{text-decoration:underline}.card + .card{margin-top:15px}
.label{font-size:12px;font-weight:700;color:var(--green);letter-spacing:.06em;text-transform:uppercase}.link{font-size:14px;font-weight:700;text-decoration:none}.link:hover{text-decoration:underline}
.featured{background:var(--soft);border-color:#dce5d8;padding:31px}.featured .label{display:inline-block;background:#d7e5d4;padding:5px 9px;border-radius:999px}
.section-heading{font-size:27px;margin:45px 0 20px}.article{background:var(--white);border:1px solid var(--rule);border-radius:14px;padding:clamp(20px,5vw,48px);line-height:1.75}.article h2{border-top:1px solid var(--rule);padding-top:30px;margin-top:36px}.article h2:first-child{border-top:0;padding-top:0}.article h3{font-size:22px}.article p{margin:13px 0}.article ul{padding-left:21px}.article li{margin:8px 0}.article img{max-width:100%;height:auto;border-radius:10px}.article a{text-underline-offset:3px}.article .lead{font-family:Georgia,serif;font-size:20px;line-height:1.6;color:#465a49}
.cta{margin:42px 0 54px;padding:34px;background:var(--ink);border-radius:14px;color:white}.cta h2{font-size:29px;margin:0 0 13px;color:white}.cta p{color:#d6e5d9;margin:0 0 19px}.button{display:inline-block;background:#f5f6ef;padding:11px 19px;color:var(--ink);border-radius:7px;text-decoration:none;font-weight:700;font-size:14px}.button:hover{background:#dfe8de}
.crumbs{padding-top:27px;font-size:13px;color:var(--muted)}.crumbs a{color:var(--muted)}.issue-header{padding:30px 0 28px}.issue-header h1{font-size:clamp(33px,5vw,48px)}.issue-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:23px 0;border-top:1px solid var(--rule);margin-top:28px;font-size:14px}
footer{border-top:1px solid var(--rule);margin-top:45px;background:var(--white);font-size:13px;color:var(--muted)}footer .container{padding:22px 0;display:flex;align-items:center;justify-content:space-between;gap:12px}
.empty{text-align:center;border:1px dashed #c7d6ca;border-radius:14px;padding:50px 22px;background:white;color:var(--muted)}.empty h2{margin:0 0 12px;color:var(--ink)}
@media(max-width:640px){.container{width:min(100% - 28px,850px)}.topbar{min-height:70px}.brand{font-size:20px}nav{gap:11px}nav a{font-size:12px}.hero{padding:44px 0 27px}.card{padding:20px}.cta{padding:24px}.issue-footer{align-items:flex-start;flex-direction:column}footer .container{flex-direction:column;align-items:flex-start}}
`;
write('assets/site.css', css);

function shell({title, description, canonical, content, index = true, type = 'website', structured = null}) {
  const ld = structured ? `<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>` : '';
  return `<!doctype html><html lang="en-NZ"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(title)} | ChchWeekly</title><meta name="description" content="${escapeHTML(description)}">
<meta name="robots" content="${index ? 'index,follow' : 'noindex,follow'}">
<link rel="canonical" href="${escapeHTML(canonical)}"><link rel="stylesheet" href="/assets/site.css">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="ChchWeekly">
<meta property="og:title" content="${escapeHTML(title)}"><meta property="og:description" content="${escapeHTML(description)}"><meta property="og:url" content="${escapeHTML(canonical)}">
${ld}</head><body>
<header class="site-header"><div class="container topbar"><a class="brand" href="/"><span class="brand-mark">C</span> CHCHWEEKLY</a><nav aria-label="Main navigation"><a href="/latest/">Latest</a><a href="/editions/">Past editions</a><a href="${MAIN}/">Subscribe</a></nav></div></header>
<main>${content}</main><footer><div class="container"><span>Made in Ōtautahi Christchurch · © ${new Date().getUTCFullYear()} ChchWeekly</span><span><a href="${MAIN}/">Main website</a> · <a href="${MAIN}/perks">Subscriber perks</a></span></div></footer></body></html>`;
}
function signup() {return `<section class="cta"><h2>Love knowing what's happening in Christchurch?</h2><p>Get the best local events, things to do and news straight to your inbox every Thursday. Free to subscribe.</p><a class="button" href="${MAIN}/">Get ChchWeekly free →</a></section>`;}
function card(e, featured=false) {
  return `<article class="card ${featured ? 'featured':''}">${featured?'<span class="label">Latest edition</span>':`<span class="label">${escapeHTML(shortDate(e.date))}</span>`}<h2><a class="title-link" href="/editions/${e.slug}/">${escapeHTML(e.title)}</a></h2><p>${escapeHTML(e.description)}</p><a class="link" href="/editions/${e.slug}/">Read edition →</a></article>`;
}
const latest = editions[0] || null;
const rootContent = `<div class="container"><section class="hero"><p class="eyebrow">Christchurch, New Zealand · Local weekly guide</p><h1>Discover what's happening in Christchurch.</h1><p class="subhead">The best events, markets, live music, things to do and local stories — curated every Thursday by ChchWeekly.</p></section>
${latest ? card(latest,true) : `<div class="empty"><h2>Our archive is almost ready</h2><p>We are getting the latest ChchWeekly edition ready to read online.</p><a class="link" href="${MAIN}/">Subscribe to the newsletter →</a></div>`}
${editions.length>1?`<h2 class="section-heading">Previous editions</h2>${editions.slice(1,5).map(e=>card(e)).join('')}<p style="margin:22px 0"><a class="link" href="/editions/">Browse all editions →</a></p>`:''}${signup()}</div>`;
write('index.html',shell({title:'Christchurch Events & Weekly Newsletter Archive',description:'Explore the latest Christchurch events, weekend activities, local news and ChchWeekly newsletter editions.',canonical:`${DOMAIN}/`,content:rootContent,index:!!latest}));
write('editions/index.html',shell({title:'Past Editions – Christchurch Events and Local News',description:'Browse previous ChchWeekly editions featuring Christchurch events, things to do, local headlines and subscriber news.',canonical:`${DOMAIN}/editions/`,content:`<div class="container"><section class="hero"><p class="eyebrow">All editions</p><h1>ChchWeekly archive</h1><p class="subhead">Catch up on events, local news and ideas for exploring Christchurch from previous weeks.</p></section>${editions.length?editions.map(e=>card(e)).join(''):'<div class="empty"><h2>No published editions yet</h2><p>We are adding our first issue soon.</p></div>'}${signup()}</div>`,index:!!latest}));
function issuePage(e, isLatest=false, index=true) {
  return shell({title:e.title, description:e.description, canonical:`${DOMAIN}/editions/${e.slug}/`,index,type:'article',structured:index?{
    '@context':'https://schema.org','@type':'BlogPosting',headline:e.title,description:e.description,datePublished:e.date,dateModified:e.updatedDate||e.date,
    mainEntityOfPage:`${DOMAIN}/editions/${e.slug}/`,publisher:{'@type':'Organization',name:'ChchWeekly',url:MAIN},inLanguage:'en-NZ'
  }:null,content:`<div class="container"><div class="crumbs"><a href="/">Home</a> / <a href="/editions/">Editions</a> / ${escapeHTML(shortDate(e.date))}</div>
<header class="issue-header"><p class="eyebrow">${isLatest?'This week in Christchurch':'ChchWeekly edition'}</p><h1>${escapeHTML(e.title)}</h1><p class="subhead">${escapeHTML(e.description)}</p><div class="meta">Published ${escapeHTML(slugDate(e.date))} · Ōtautahi Christchurch</div></header>
<article class="article">${e.html}</article><div class="issue-footer"><a class="link" href="/editions/">← Browse past editions</a><a class="link" href="/latest/">Read the latest edition →</a></div>${signup()}</div>`});
}
for (const e of editions) write(`editions/${e.slug}/index.html`,issuePage(e));
if (latest) {
  write('latest/index.html',issuePage(latest,true,true));
} else {
  write('latest/index.html',shell({title:'Latest Christchurch Newsletter Edition',description:'The latest ChchWeekly edition will be available here soon.',canonical:`${DOMAIN}/latest/`,index:false,content:`<div class="container"><section class="hero"><h1>The latest ChchWeekly is coming soon.</h1><p class="subhead">In the meantime, subscribe for your weekly guide to Christchurch.</p><p><a class="button" href="${MAIN}/">Subscribe free →</a></p></section></div>`}));
}
// Optional aliases and crawler discovery files.
write('_redirects', '/archive /editions/ 301\n');
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
const sitemapEntries = latest ? ['/', '/editions/', ...editions.map(e=>`/editions/${e.slug}/`)] : [];
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map(p=>`  <url><loc>${xml(DOMAIN+p)}</loc></url>`).join('\n')}\n</urlset>\n`);
write('feed.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>ChchWeekly editions</title><link>${DOMAIN}/</link><description>Christchurch events and local news every week</description><language>en-nz</language>${editions.map(e=>`<item><title>${xml(e.title)}</title><link>${DOMAIN}/editions/${e.slug}/</link><guid>${DOMAIN}/editions/${e.slug}/</guid><description>${xml(e.description)}</description><pubDate>${new Date(e.date+'T09:00:00+13:00').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`);
console.log(`Built ${editions.length} published edition(s) in dist/. Drafts are excluded.`);
