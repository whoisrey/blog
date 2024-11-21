/* empty css                                   */
import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, d as renderComponent, e as renderSlot, F as Fragment, f as renderHead } from '../../chunks/astro/server_kHpqL8PH.mjs';
import 'kleur/colors';
import { S as SITE_TITLE, a as SITE_DESCRIPTION, b as SITE_URL, M as MY_NAME, T as TWITTER_HANDLE, r as readOne, c as readAll, d as blog } from '../../chunks/config_D8YeFbH8.mjs';
import Markdoc from '@markdoc/markdoc';
import MarkdownIt from 'markdown-it';
import 'clsx';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
/* empty css                                     */
import slugify from 'slugify';
import { g as getBlogPostMeta, $ as $$Favicon, a as $$GoogleFont, b as $$ThemeScript, c as $$FontAwesome, d as $$Header, e as $$Footer } from '../../chunks/Footer_CXDr1Vfg.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const { Tag: MarkdocTag } = Markdoc;
const { escapeHtml } = MarkdownIt().utils;
class Node {
  constructor(n, components2) {
    if (!n) {
      throw new Error("Missing arg: n");
    }
    this.node = n;
    this.components = components2;
    let children = this.node?.children;
    if (typeof this.node === "string" || typeof this.node === "number") {
      children = escapeHtml(String(this.node));
    } else if (this.node === null || typeof this.node !== "object" || !MarkdocTag.isTag(this.node)) {
      children = "";
    }
    this.children = children;
    let tag = this.node?.name;
    let props = this.node?.attributes;
    if (typeof this.node?.name === "string" && typeof components2 === "object" && Object.hasOwn(components2, this.node?.name)) {
      tag = components2[this.node?.name].Component;
      props = {
        ...props,
        ...components2[this.node?.name].props,
        children: this.children
      };
    } else if (typeof this.node?.name === "string") {
      tag = this.node?.name;
      props = { ...this.node?.attributes };
    }
    this.tag = tag;
    this.props = props;
  }
  validateElement() {
    if (typeof this.node?.name === "string" && // custom elements start with Uppercase
    this.node.name.charAt(0).toLowerCase() !== this.node.name.charAt(0) && // TODO: this condition could be improved
    typeof components === "object" && // component for the custom element not found
    !Object.hasOwn(this.components, this.node.name)) {
      throw new Error(`No renderer provided for element: ${this.node.name}`);
    }
  }
  hasChildren() {
    return Array.isArray(this.node?.children);
  }
  shouldRenderChildren() {
    return !Array.isArray(this.node) && (typeof this.node === "string" || typeof this.node === "number" || this.node === null || typeof this.node !== "object" || !MarkdocTag.isTag(this.node));
  }
  shouldRenderSelf() {
    return Array.isArray(this.node);
  }
  shouldRenderTag() {
    return !!this.tag;
  }
}

function addAstro(Prism) {
  if (Prism.languages.astro) {
    return;
  }
  let scriptLang;
  if (Prism.languages.typescript) {
    scriptLang = "typescript";
  } else {
    scriptLang = "javascript";
    console.warn(
      "Prism TypeScript language not loaded, Astro scripts will be treated as JavaScript."
    );
  }
  let script = Prism.util.clone(Prism.languages[scriptLang]);
  let space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  let braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  let spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
  function re(source, flags) {
    source = source.replace(/<S>/g, function() {
      return space;
    }).replace(/<BRACES>/g, function() {
      return braces;
    }).replace(/<SPREAD>/g, function() {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism.languages.astro = Prism.languages.extend("markup", script);
  Prism.languages.astro.tag.pattern = re(
    /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
  );
  Prism.languages.astro.tag.inside["tag"].pattern = /^<\/?[^\s>\/]*/i;
  Prism.languages.astro.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[^]|[^\\"])*"|'(?:\\[^]|[^\\'])*'|[^\s'">]+)/i;
  Prism.languages.astro.tag.inside["tag"].inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.astro.tag.inside["comment"] = script["comment"];
  Prism.languages.insertBefore(
    "inside",
    "attr-name",
    {
      spread: {
        pattern: re(/<SPREAD>/.source),
        inside: Prism.languages.astro
      }
    },
    Prism.languages.astro.tag
  );
  Prism.languages.insertBefore(
    "inside",
    "special-attr",
    {
      script: {
        pattern: re(/=<BRACES>/.source),
        inside: {
          "script-punctuation": {
            pattern: /^=(?={)/,
            alias: "punctuation"
          },
          rest: Prism.languages.astro
        },
        alias: `language-${scriptLang}`
      }
    },
    Prism.languages.astro.tag
  );
  let stringifyToken = function(token) {
    if (!token) {
      return "";
    }
    if (typeof token === "string") {
      return token;
    }
    if (typeof token.content === "string") {
      return token.content;
    }
    return token.content.map(stringifyToken).join("");
  };
  let walkTokens = function(tokens) {
    let openedTags = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (token.type === "style") {
        return;
      }
      let notTagNorBrace = false;
      if (typeof token !== "string") {
        if (token.type === "tag" && token.content[0] && token.content[0].type === "tag") {
          if (token.content[0].content[0].content === "</") {
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === "/>") ; else {
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === "punctuation" && token.content === "{") {
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === "punctuation" && token.content === "}") {
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === "string") {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          let plainText = stringifyToken(token);
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === "string" || tokens[i + 1].type === "plain-text")) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === "string" || tokens[i - 1].type === "plain-text")) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism.Token("plain-text", plainText, void 0, plainText);
        }
      }
      if (token.content && typeof token.content !== "string") {
        walkTokens(token.content);
      }
    }
  };
  Prism.hooks.add("after-tokenize", function(env) {
    if (env.language !== "astro") {
      return;
    }
    walkTokens(env.tokens);
  });
}

const languageMap = /* @__PURE__ */ new Map([["ts", "typescript"]]);
function runHighlighterWithAstro(lang, code) {
  if (!lang) {
    lang = "plaintext";
  }
  let classLanguage = `language-${lang}`;
  const ensureLoaded = (language) => {
    if (language && !Prism.languages[language]) {
      loadLanguages([language]);
    }
  };
  if (languageMap.has(lang)) {
    ensureLoaded(languageMap.get(lang));
  } else if (lang === "astro") {
    ensureLoaded("typescript");
    addAstro(Prism);
  } else {
    ensureLoaded("markup-templating");
    ensureLoaded(lang);
  }
  if (lang && !Prism.languages[lang]) {
    console.warn(`Unable to load the language: ${lang}`);
  }
  const grammar = Prism.languages[lang];
  let html = code;
  if (grammar) {
    html = Prism.highlight(code, grammar, lang);
  }
  return { classLanguage, html };
}

const $$Astro$c = createAstro("http://localhost:3000");
const $$Prism = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Prism;
  const { class: className, lang, code } = Astro2.props;
  const { classLanguage, html } = runHighlighterWithAstro(lang, code);
  return renderTemplate`${maybeRenderHead()}<pre${addAttribute([className, classLanguage].filter(Boolean).join(" "), "class")}><code${addAttribute(classLanguage, "class")}>${unescapeHTML(html)}</code></pre>`;
}, "/Users/leche/Desktop/github/blog/node_modules/@astrojs/prism/Prism.astro", void 0);

const $$Astro$b = createAstro("http://localhost:3000");
const $$CodeBlock$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$CodeBlock$1;
  const { language, content } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Prism", $$Prism, { "lang": language, "code": content })} `;
}, "/Users/leche/Desktop/github/blog/node_modules/astro-markdoc-renderer/src/CodeBlock.astro", void 0);

const $$Code = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<code>${renderSlot($$result, $$slots["default"])}</code>`;
}, "/Users/leche/Desktop/github/blog/node_modules/astro-markdoc-renderer/src/Code.astro", void 0);

const $$Astro$a = createAstro("http://localhost:3000");
const $$MarkdocRenderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$MarkdocRenderer;
  const { content, components: customComponents } = Astro2.props;
  const defaultComponents = {
    CodeBlock: {
      Component: $$CodeBlock$1,
      props: {}
    },
    code: {
      Component: $$Code,
      props: {}
    }
  };
  const components = { ...defaultComponents, ...customComponents };
  if (!content) {
    throw new Error("Missing prop: content");
  }
  const node = new Node(content, components);
  node.validateElement();
  const Tag = node.tag;
  const props = node.props;
  const children = node.children;
  return renderTemplate`${node.shouldRenderChildren() ? (
    // IMPORTANT - DO NOT SELF CLOSE THIS TAG. ASTRO FREAKS OUT.
    renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(children)}` })}`
  ) : node.shouldRenderSelf() ? (
    // @ts-ignore
    content.map((element) => {
      return renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "content": element, "components": components })}`;
    })
  ) : node.shouldRenderTag() ? renderTemplate`${renderComponent($$result, "Tag", Tag, { ...props }, { "default": ($$result2) => renderTemplate`${node.hasChildren() ? renderTemplate`${renderComponent($$result2, "Astro.self", Astro2.self, { "content": children, "components": components })}` : null}` })}` : null}`;
}, "/Users/leche/Desktop/github/blog/node_modules/astro-markdoc-renderer/src/MarkdocRenderer.astro", void 0);

const $$Astro$9 = createAstro("http://localhost:3000");
const $$YouTubeEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$YouTubeEmbed;
  const { url, label } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div> <iframe class="aspect-video w-full"${addAttribute(url, "src")}${addAttribute(label, "title")} frame-border="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe> </div>`;
}, "/Users/leche/Desktop/github/blog/src/components/YouTubeEmbed.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$8 = createAstro("http://localhost:3000");
const $$TweetEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$TweetEmbed;
  const { url } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="relative not-prose flex flex-col items-center justify-center"> <blockquote class="twitter-tweet" data-conversation="none" data-theme="light" data-lang="en" data-dnt="true"> <a class="unset absolute left-0 top-0"', '>Loading embedded tweet...</a> </blockquote> </div> <script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>'])), maybeRenderHead(), addAttribute(url, "href"));
}, "/Users/leche/Desktop/github/blog/src/components/TweetEmbed.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$7 = createAstro("http://localhost:3000");
const $$CodePenEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$CodePenEmbed;
  const { url, title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="eYJqjgq" data-user="ruphaa" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;"> <span><a', ">", '</a></span> </p> <script async defer src="https://cpwebassets.codepen.io/assets/embed/ei.js"><\/script>'])), maybeRenderHead(), addAttribute(url, "href"), title);
}, "/Users/leche/Desktop/github/blog/src/components/CodePenEmbed.astro", void 0);

const $$Astro$6 = createAstro("http://localhost:3000");
const $$GitHubGistEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$GitHubGistEmbed;
  const { id } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<iframe class="gist-iframe" width="100%" style="border:0;"${addAttribute(`gist-${id}`, "id")}${addAttribute(id, "data-id")}></iframe> `;
}, "/Users/leche/Desktop/github/blog/src/components/GitHubGistEmbed.astro", void 0);

const $$Astro$5 = createAstro("http://localhost:3000");
const $$CodeBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$CodeBlock;
  const { language, content } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Prism", $$Prism, { "lang": language, "code": content })} `;
}, "/Users/leche/Desktop/github/blog/src/components/CodeBlock.astro", void 0);

const $$Astro$4 = createAstro("http://localhost:3000");
const $$Heading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Heading;
  const { level, children } = Astro2.props;
  const headingText = children.length && typeof children[0] === "string" ? children[0] : "";
  const id = slugify(headingText.toLowerCase());
  let Tag = "h1";
  let withBorder = false;
  if (level === 2) {
    Tag = "h2";
    withBorder = true;
  } else if (level === 3) {
    Tag = "h3";
    withBorder = true;
  } else if (level === 4) {
    Tag = "h4";
  } else if (level === 5) {
    Tag = "h5";
  } else if (level === 6) {
    Tag = "h6";
  }
  return renderTemplate`${withBorder ? renderTemplate`${maybeRenderHead()}<div class="after:mt-6 after:content-[''] after:block after:h-[1px] after:w-[100%] after:border-b-[1px] after:border-current"><!-- TODO: Rethink how to add the bottom border. Shouldn't wrap hx in div.
  should wrap div in hx. -->${renderComponent($$result, "Tag", Tag, { "id": id, "class": "group flex -ml-[1rem]" }, { "default": ($$result2) => renderTemplate`<span class="not-prose w-[1rem] -mt-[0.125rem]"><a aria-label="link to this heading"${addAttribute(headingText, "aria-describedby")}${addAttribute(`#${id}`, "href")} class="unset align-middle text-[14px] text-text-link opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 group-active:opacity-100 active:opacity-100"><i class="fa-solid fa-hashtag"></i></a></span><span>${children}</span>` })}</div>` : renderTemplate`${renderComponent($$result, "Tag", Tag, { "id": id, "class": "group flex -ml-[1rem]" }, { "default": ($$result2) => renderTemplate`<span class="not-prose w-[1rem] -mt-[0.125rem]"><a aria-label="link to this heading"${addAttribute(headingText, "aria-describedby")}${addAttribute(`#${id}`, "href")} class="unset align-middle text-[14px] text-text-link opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 group-active:opacity-100 active:opacity-100"><i class="fa-solid fa-hashtag"></i></a></span><span>${children}</span>` })}`}`;
}, "/Users/leche/Desktop/github/blog/src/components/Heading.astro", void 0);

const $$Astro$3 = createAstro("http://localhost:3000");
const $$Renderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Renderer;
  const { content } = Astro2.props;
  const components = {
    Heading: {
      Component: $$Heading,
      props: {}
    },
    CodeBlock: {
      Component: $$CodeBlock,
      props: {}
    },
    YouTubeEmbed: {
      Component: $$YouTubeEmbed,
      props: {}
    },
    TweetEmbed: {
      Component: $$TweetEmbed,
      props: {}
    },
    CodePenEmbed: {
      Component: $$CodePenEmbed,
      props: {}
    },
    GitHubGistEmbed: {
      Component: $$GitHubGistEmbed,
      props: {}
    }
  };
  return renderTemplate`${renderComponent($$result, "MarkdocRenderer", $$MarkdocRenderer, { "content": content, "components": components })}`;
}, "/Users/leche/Desktop/github/blog/src/components/Renderer.astro", void 0);

const $$Astro$2 = createAstro("http://localhost:3000");
const $$BlogPostMeta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BlogPostMeta;
  const {
    title,
    description,
    publishDate,
    pagePath,
    ogImageAbsoluteUrl,
    ogImageAltText,
    ogImageWidth,
    ogImageHeight
  } = Astro2.props;
  const { meta, og, twitter } = getBlogPostMeta({
    title: title || SITE_TITLE,
    description: description || SITE_DESCRIPTION,
    pageUrl: pagePath ? new URL(pagePath, SITE_URL).toString() : void 0,
    authorName: MY_NAME,
    publishDate,
    ogImageAbsoluteUrl,
    ogImageAltText,
    ogImageWidth,
    ogImageHeight,
    siteOwnerTwitterHandle: TWITTER_HANDLE,
    contentAuthorTwitterHandle: TWITTER_HANDLE
  });
  return renderTemplate`<!-- Primary Meta Tags --><title>${meta.title}</title><meta name="title"${addAttribute(meta.title, "content")}>${meta.description && renderTemplate`<meta name="description"${addAttribute(meta.description, "content")}>`}${meta.canonicalUrl && renderTemplate`<link rel="canonical"${addAttribute(meta.canonicalUrl, "href")}>`}<!-- Open Graph / Facebook -->${og.title && renderTemplate`<meta property="og:title"${addAttribute(og.title, "content")}>`}${og.description && renderTemplate`<meta property="og:description"${addAttribute(og.description, "content")}>`}${og.type && renderTemplate`<meta property="og:type"${addAttribute(og.type, "content")}>`}${og.url && renderTemplate`<meta property="og:url"${addAttribute(og.url, "content")}>`}${og.author && renderTemplate`<meta property="article:author"${addAttribute(og.author, "content")}>`}${og.publishDate && renderTemplate`<meta property="article:published_time"${addAttribute(og.publishDate, "content")}>`}${og.image && renderTemplate`<meta property="og:image"${addAttribute(og.image, "content")}>`}${og.imageAlt && renderTemplate`<meta property="og:image:alt"${addAttribute(og.imageAlt, "content")}>`}${og.imageWidth && renderTemplate`<meta property="og:image:width"${addAttribute(og.imageWidth, "content")}>`}${og.imageHeight && renderTemplate`<meta property="og:image:height"${addAttribute(og.imageHeight, "content")}>`}<!-- Twitter -->${twitter.title && renderTemplate`<meta property="twitter:title"${addAttribute(twitter.title, "content")}>`}${twitter.description && renderTemplate`<meta property="twitter:description"${addAttribute(twitter.description, "content")}>`}${twitter.site && renderTemplate`<meta property="twitter:site"${addAttribute(twitter.site, "content")}>`}${twitter.creator && renderTemplate`<meta property="twitter:creator"${addAttribute(twitter.creator, "content")}>`}<meta property="twitter:card" content="summary_large_image">${twitter.image && renderTemplate`<meta property="twitter:image"${addAttribute(twitter.image, "content")}>`}${twitter.imageAlt && renderTemplate`<meta property="twitter:image:alt"${addAttribute(twitter.imageAlt, "content")}>`}<!-- {twitter.url && <meta property="twitter:url" content={twitter.url} />} -->`;
}, "/Users/leche/Desktop/github/blog/src/components/BlogPostMeta.astro", void 0);

const $$Astro$1 = createAstro("http://localhost:3000");
const $$ContentLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ContentLayout;
  const { title, date } = Astro2.props;
  const formattedDate = new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return renderTemplate`<html class="theme-newspaper" lang="en" data-astro-cid-scuu7fyy> <head><!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="generator" content="Blogster">${renderComponent($$result, "Favicon", $$Favicon, { "data-astro-cid-scuu7fyy": true })}${renderSlot($$result, $$slots["meta"])}${renderComponent($$result, "GoogleFont", $$GoogleFont, { "data-astro-cid-scuu7fyy": true })}${renderComponent($$result, "ThemeScript", $$ThemeScript, { "data-astro-cid-scuu7fyy": true })}${renderComponent($$result, "FontAwesome", $$FontAwesome, { "data-astro-cid-scuu7fyy": true })}${renderHead()}</head> <body class="max-w-3xl mx-auto min-h-screen px-6 sm:px-8" data-astro-cid-scuu7fyy> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-scuu7fyy": true })} <main id="main" data-astro-cid-scuu7fyy> <section class="blog-post prose max-w-none prose-newspaper" data-astro-cid-scuu7fyy> <h1 class="
            m-0 pt-1 mb-[0.375em] 
            after:mt-6 after:content-[''] after:block after:h-[1px] after:w-[100%] after:border-b-[1px] after:border-current  
        " data-astro-cid-scuu7fyy>${title}</h1> <time class="block mb-[2em] text-text-muted" data-astro-cid-scuu7fyy>${formattedDate}</time> ${renderSlot($$result, $$slots["content"])} </section> </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-scuu7fyy": true })}  </body> </html>`;
}, "/Users/leche/Desktop/github/blog/src/layouts/ContentLayout.astro", void 0);

const $$Astro = createAstro("http://localhost:3000");
async function getStaticPaths() {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const filteredPosts = posts.filter((p) => p.frontmatter.draft !== true).filter(({ frontmatter }) => !frontmatter.external);
  return filteredPosts.map((post) => {
    return { params: { slug: post.slug } };
  });
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (typeof slug !== "string") {
    throw Error(`slug should be string. Received: ${slug}`);
  }
  const { content, frontmatter } = await readOne({
    directory: "blog",
    slug,
    frontmatterSchema: blog
  });
  const ogImageAbsoluteUrl = frontmatter.external !== true && frontmatter.ogImagePath ? new URL(frontmatter.ogImagePath, SITE_URL).toString() : void 0;
  return renderTemplate`${renderComponent($$result, "ContentLayout", $$ContentLayout, { "title": frontmatter.title, "date": frontmatter.date }, { "content": ($$result2) => renderTemplate`${renderComponent($$result2, "Renderer", $$Renderer, { "content": content, "slot": "content" })}`, "meta": ($$result2) => renderTemplate`${renderComponent($$result2, "BlogPostMeta", $$BlogPostMeta, { "title": frontmatter.title, "description": frontmatter.external ? void 0 : frontmatter.description, "publishDate": frontmatter.date.toISOString(), "pagePath": `/blog/${slug}`, "ogImageAbsoluteUrl": ogImageAbsoluteUrl, "slot": "meta" })}` })}`;
}, "/Users/leche/Desktop/github/blog/src/pages/blog/[slug].astro", void 0);

const $$file = "/Users/leche/Desktop/github/blog/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
