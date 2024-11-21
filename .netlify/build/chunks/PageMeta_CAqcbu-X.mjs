import { a as createComponent, r as renderTemplate, d as renderComponent, e as renderSlot, f as renderHead, c as createAstro, b as addAttribute } from './astro/server_kHpqL8PH.mjs';
import 'kleur/colors';
/* empty css                          */
import { $ as $$Favicon, a as $$GoogleFont, b as $$ThemeScript, c as $$FontAwesome, d as $$Header, e as $$Footer, f as getPageMeta } from './Footer_CXDr1Vfg.mjs';
/* empty css                        */
import 'clsx';
import { S as SITE_TITLE, a as SITE_DESCRIPTION, b as SITE_URL, T as TWITTER_HANDLE } from './config_D8YeFbH8.mjs';

const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html class="theme-newspaper" lang="en" data-astro-cid-3zbxo6iv> <head><!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="generator" content="Blogster">${renderComponent($$result, "Favicon", $$Favicon, { "data-astro-cid-3zbxo6iv": true })}${renderSlot($$result, $$slots["meta"])}${renderComponent($$result, "GoogleFont", $$GoogleFont, { "data-astro-cid-3zbxo6iv": true })}${renderComponent($$result, "ThemeScript", $$ThemeScript, { "data-astro-cid-3zbxo6iv": true })}${renderComponent($$result, "FontAwesome", $$FontAwesome, { "data-astro-cid-3zbxo6iv": true })}${renderHead()}</head> <body class="max-w-3xl mx-auto min-h-screen px-6 sm:px-8" data-astro-cid-3zbxo6iv> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-3zbxo6iv": true })} <main id="main" data-astro-cid-3zbxo6iv> ${renderSlot($$result, $$slots["main"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-3zbxo6iv": true })}  </body> </html>`;
}, "/Users/leche/Desktop/github/blog/src/layouts/PageLayout.astro", void 0);

const $$Astro = createAstro("http://localhost:3000");
const $$PageMeta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageMeta;
  const { title, description } = Astro2.props;
  const { meta, og, twitter } = getPageMeta({
    title: title || SITE_TITLE,
    description: description || SITE_DESCRIPTION,
    baseUrl: SITE_URL,
    ogImageAbsoluteUrl: `${SITE_URL}/images/og.png`,
    ogImageAltText: "My fancy website",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    siteOwnerTwitterHandle: TWITTER_HANDLE,
    contentAuthorTwitterHandle: TWITTER_HANDLE
  });
  return renderTemplate`<!-- Primary Meta Tags --><title>${meta.title}</title><meta name="title"${addAttribute(meta.title, "content")}>${meta.description && renderTemplate`<meta name="description"${addAttribute(meta.description, "content")}>`}<!-- Open Graph / Facebook -->${og.title && renderTemplate`<meta property="og:title"${addAttribute(og.title, "content")}>`}${og.description && renderTemplate`<meta property="og:description"${addAttribute(og.description, "content")}>`}${og.type && renderTemplate`<meta property="og:type"${addAttribute(og.type, "content")}>`}${og.url && renderTemplate`<meta property="og:url"${addAttribute(og.url, "content")}>`}${og.image && renderTemplate`<meta property="og:image"${addAttribute(og.image, "content")}>`}${og.imageAlt && renderTemplate`<meta property="og:image:alt"${addAttribute(og.imageAlt, "content")}>`}${og.imageWidth && renderTemplate`<meta property="og:image:width"${addAttribute(og.imageWidth, "content")}>`}${og.imageHeight && renderTemplate`<meta property="og:image:height"${addAttribute(og.imageHeight, "content")}>`}<!-- Twitter -->${twitter.title && renderTemplate`<meta property="twitter:title"${addAttribute(twitter.title, "content")}>`}${twitter.description && renderTemplate`<meta property="twitter:description"${addAttribute(twitter.description, "content")}>`}${twitter.site && renderTemplate`<meta property="twitter:site"${addAttribute(twitter.site, "content")}>`}${twitter.creator && renderTemplate`<meta property="twitter:creator"${addAttribute(twitter.creator, "content")}>`}<meta property="twitter:card" content="summary_large_image">${twitter.image && renderTemplate`<meta property="twitter:image"${addAttribute(twitter.image, "content")}>`}${twitter.imageAlt && renderTemplate`<meta property="twitter:image:alt"${addAttribute(twitter.imageAlt, "content")}>`}<!-- {twitter.url && <meta property="twitter:url" content={twitter.url} />} -->`;
}, "/Users/leche/Desktop/github/blog/src/components/PageMeta.astro", void 0);

export { $$PageMeta as $, $$PageLayout as a };
