import rss from '@astrojs/rss';
import { c as readAll, d as blog, S as SITE_TITLE, a as SITE_DESCRIPTION, b as SITE_URL } from '../chunks/config_D8YeFbH8.mjs';
export { renderers } from '../renderers.mjs';

const get = async () => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog
  });
  const sortedPosts = posts.filter((p) => p.frontmatter.draft !== true).sort(
    (a, b) => new Date(b.frontmatter.date).valueOf() - new Date(a.frontmatter.date).valueOf()
  );
  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");
  const rssItems = sortedPosts.map(({ frontmatter, slug }) => {
    if (frontmatter.external) {
      const title2 = frontmatter.title;
      const pubDate2 = frontmatter.date;
      const link2 = frontmatter.url;
      return {
        title: title2,
        pubDate: pubDate2,
        link: link2
      };
    }
    const title = frontmatter.title;
    const pubDate = frontmatter.date;
    const description = frontmatter.description;
    const link = `${baseUrl}/blog/${slug}`;
    return {
      title,
      pubDate,
      description,
      link
    };
  });
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
