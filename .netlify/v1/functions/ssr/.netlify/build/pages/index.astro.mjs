/* empty css                                */
import { a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderComponent, F as Fragment } from '../chunks/astro/server_kHpqL8PH.mjs';
import 'kleur/colors';
import { $ as $$PageMeta, a as $$PageLayout } from '../chunks/PageMeta_CAqcbu-X.mjs';
import 'clsx';
import { c as readAll, d as blog, p as project, S as SITE_TITLE } from '../chunks/config_D8YeFbH8.mjs';
export { renderers } from '../renderers.mjs';

const $$Intro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="mb-8"> <div class="mb-6"> <h1 class="font-bold uppercase text-center text-4xl md:text-5xl xtracking-tighter py-6 overflow-hidden"> <span class="bg-gradient-to-br from-[#334155] via-[#1e293b] to-[#0f172a] dark:from-primary-main dark:via-primary-main dark:to-primary-main bg-clip-text text-transparent">
기록하고 기억하기.
</span> </h1> <div class="border-b-[1px] border-t-[1px] border-current py-1 flex items-center justify-center gap-10"> <a class="unset ml-4 hover:text-text-link" href="https://twitter.com/flexdinesh" aria-label="Dinesh on Twitter"> <i class="fa-brands fa-twitter" aria-hidden="true" title="Dinesh on Twitter"></i> <span>이메일</span> </a> <a class="unset ml-4 hover:text-text-link" href="https://github.com/flexdinesh/blogster"> <i class="fa-brands fa-github" aria-hidden="true" title="Blogster on GitHub"></i> <span>깃헙</span> </a> </div> <!-- <p class="text-2xl pb-4">Web Developer. OSS Wizard. Blogger.</p> --> </div> <div> <p class="mb-8"></p> <p class="text-center whitespace-nowrap overflow-auto">
“읽기 쉽고 이해하기 쉬운 코드" 작성을 추구하는 개발자가 되고자 합니다. <br>
또한, 올바른 소통 방식에 대해 끊임없이 고민하고 함께 성장하는 문화 형성을 지향합니다.
</p> </div> </section>`;
}, "/Users/leche/Desktop/github/blog/src/components/Intro.astro", void 0);

const $$AboutTheTheme = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const sortedPosts = posts.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  const projects = await readAll({
    directory: "projects",
    frontmatterSchema: project
  });
  const sortedProjects = projects.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  return renderTemplate`${maybeRenderHead()}<div> <p>최신 글 :</p> <ul> ${sortedPosts.slice(0, 2).map((post) => {
    const formattedDate = new Date(
      post.frontmatter.date
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<li class="grid grid-cols-[1fr] md:grid-cols-[1fr_auto] mb-3 md:gap-2 items-start"> <div class="title"> ${post.frontmatter.external ? renderTemplate`<a${addAttribute(post.frontmatter.url, "href")} target="_blank" class="unset hover:text-text-link"> <span>${post.frontmatter.title}</span> <span> <i class="ml-1 mr-1 text-[12px] pb-2 fa-solid fa-up-right-from-square"></i> </span> </a>` : renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="unset hover:text-text-link"> ${post.frontmatter.title} </a>`} </div> <div class="text-text-muted text-sm italic pt-1"> <time${addAttribute(post.frontmatter.date.toISOString(), "datetime")}> ${formattedDate} </time> </div> </li>`;
  })} </ul> </div> <br> <div> <p>최신 프로젝트 :</p> <ul> ${sortedProjects.slice(0, 2).map((project2) => {
    const formattedDate = new Date(
      project2.frontmatter.date
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    return renderTemplate`<li class="grid grid-cols-[1fr] md:grid-cols-[1fr_auto] mb-3 md:gap-2 items-start"> <div class="title"> <a${addAttribute(project2.frontmatter.url, "href")} target="_blank" class="unset hover:text-text-link"> <span>${project2.frontmatter.title}</span> <span> <i class="ml-1 mr-1 text-[12px] pb-2 fa-solid fa-up-right-from-square"></i> </span> </a> </div> <div class="text-text-muted text-sm italic pt-1"> <time${addAttribute(project2.frontmatter.date.toISOString(), "datetime")}> ${formattedDate} </time> </div> </li>`;
  })} </ul> </div>`;
}, "/Users/leche/Desktop/github/blog/src/components/AboutTheTheme.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, {}, { "main": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "main" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Intro", $$Intro, {})} ${renderComponent($$result3, "AboutTheTheme", $$AboutTheTheme, {})} ` })}`, "meta": ($$result2) => renderTemplate`${renderComponent($$result2, "PageMeta", $$PageMeta, { "title": `${SITE_TITLE} | Web Ninja`, "slot": "meta" })}` })}`;
}, "/Users/leche/Desktop/github/blog/src/pages/index.astro", void 0);

const $$file = "/Users/leche/Desktop/github/blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
