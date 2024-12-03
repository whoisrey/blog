import rss from "@astrojs/rss";
import { blog } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";

export const GET = async () => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog,
  });

  const sortedPosts = posts
    .filter((p) => p.frontmatter.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).valueOf() -
        new Date(a.frontmatter.date).valueOf()
    );

  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssItems = sortedPosts.map(({ frontmatter, slug }) => {
    if (frontmatter.external) {
      return {
        title: frontmatter.title,
        pubDate: frontmatter.date,
        link: frontmatter.url,
      };
    }

    return {
      title: frontmatter.title,
      pubDate: frontmatter.date,
      description: frontmatter.description,
      link: `${baseUrl}/blog/${slug}`,
    };
  });

  const feed = await rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems,
  });

  return new Response(feed.body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
