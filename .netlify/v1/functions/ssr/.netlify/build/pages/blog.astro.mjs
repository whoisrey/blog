/* empty css                                */
import { a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_kHpqL8PH.mjs';
import 'kleur/colors';
import { c as readAll, d as blog, S as SITE_TITLE } from '../chunks/config_D8YeFbH8.mjs';
import { $ as $$PageMeta, a as $$PageLayout } from '../chunks/PageMeta_CAqcbu-X.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const sortedPosts = posts.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {}, { "main": ($$result2) => renderTemplate`${maybeRenderHead()}<section> <ul> ${sortedPosts.map((post) => {
    const formattedDate = new Date(
      post.frontmatter.date
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<li class="grid grid-cols-[1fr] md:grid-cols-[1fr_auto] mb-3 md:gap-2 items-start"> <div class="title"> ${post.frontmatter.external ? renderTemplate`<a${addAttribute(post.frontmatter.url, "href")} target="_blank" class="unset hover:text-text-link"> <span>${post.frontmatter.title}</span> <span> <i class="ml-1 mr-1 text-[12px] pb-2 fa-solid fa-up-right-from-square"></i> </span> </a>` : renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="unset hover:text-text-link"> ${post.frontmatter.title} </a>`} </div> <div class="text-text-muted text-sm italic pt-1"> <time${addAttribute(post.frontmatter.date.toISOString(), "datetime")}> ${formattedDate} </time> </div> </li>`;
  })} </ul> </section>`, "meta": ($$result2) => renderTemplate`${renderComponent($$result2, "PageMeta", $$PageMeta, { "title": `Blog | ${SITE_TITLE}`, "slot": "meta" })}` })}`;
}, "/Users/leche/Desktop/github/blog/src/pages/blog.astro", void 0);

const $$file = "/Users/leche/Desktop/github/blog/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
