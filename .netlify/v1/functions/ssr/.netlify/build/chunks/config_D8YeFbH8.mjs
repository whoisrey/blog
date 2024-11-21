import path from 'path';
import matter from 'gray-matter';
import fs from 'fs/promises';
import { globby } from 'globby';
import Markdoc from '@markdoc/markdoc';
import { z } from 'zod';

const { nodes, Tag } = Markdoc;
const config = {
  tags: {
    details: {
      render: "details",
      children: nodes.document.children
    },
    summary: {
      render: "summary",
      children: nodes.document.children
    },
    sup: {
      render: "sup",
      children: nodes.strong.children
    },
    sub: {
      render: "sub",
      children: nodes.strong.children
    },
    abbr: {
      render: "abbr",
      attributes: {
        title: { type: String }
      },
      children: nodes.strong.children
    },
    kbd: {
      render: "kbd",
      children: nodes.strong.children
    },
    mark: {
      render: "mark",
      children: nodes.strong.children
    },
    youtube: {
      render: "YouTubeEmbed",
      attributes: {
        url: { type: String, required: true },
        label: { type: String, required: true }
      },
      selfClosing: true
    },
    tweet: {
      render: "TweetEmbed",
      attributes: {
        url: { type: String, required: true }
      },
      selfClosing: true
    },
    codepen: {
      render: "CodePenEmbed",
      attributes: {
        url: { type: String, required: true },
        title: { type: String, required: true }
      },
      selfClosing: true
    },
    githubgist: {
      render: "GitHubGistEmbed",
      attributes: {
        id: { type: String, required: true }
      },
      selfClosing: true
    }
  },
  nodes: {
    heading: {
      render: "Heading",
      attributes: {
        level: { type: Number, required: true }
      },
      transform(node, config2) {
        const attributes = node.transformAttributes(config2);
        const children = node.transformChildren(config2);
        return new Tag(this.render, { ...attributes }, children);
      }
    },
    // if you want to customise default tags, this is where you'd do it
    // after adding the code here, add an Astro component for this node
    // in Renderer.astro component
    // paragraph: {
    //   render: "paragraph",
    //   transform(node, config) {
    //     const attributes = node.transformAttributes(config);
    //     const children = node.transformChildren(config);
    //     return new Tag(this.render, { ...attributes }, children);
    //   },
    // },
    fence: {
      render: "CodeBlock",
      attributes: {
        content: { type: String, render: false, required: true },
        language: { type: String, default: "typescript" },
        // process determines whether or not markdoc processes tags inside the content of the code block
        process: { type: Boolean, render: false, default: false }
      },
      transform(node, config2) {
        const attributes = node.transformAttributes(config2);
        const children = node.transformChildren(config2);
        if (children.some((child) => typeof child !== "string")) {
          throw new Error(
            `unexpected non-string child of code block from ${node.location?.file ?? "(unknown file)"}:${node.location?.start.line ?? "(unknown line)"}`
          );
        }
        return new Tag(
          this.render,
          { ...attributes, content: children.join("") },
          []
        );
      }
    }
  }
};

const contentDirectory = path.normalize("./content");
async function parseAndTransform({ content }) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast, config);
  if (errors.length) {
    console.error(errors);
    throw new Error("Markdoc validation error");
  }
  const transformedContent = Markdoc.transform(ast, config);
  return transformedContent;
}
function validateFrontmatter({
  frontmatter,
  schema,
  filepath
}) {
  try {
    const validatedFrontmatter = schema.parse(frontmatter);
    return validatedFrontmatter;
  } catch (e) {
    const errMessage = `
      There was an error validating your frontmatter. 
      Please make sure your frontmatter for file: ${filepath} matches its schema.
    `;
    throw Error(errMessage + e.message);
  }
}
async function read({
  filepath,
  schema
}) {
  const rawString = await fs.readFile(filepath, "utf8");
  const { content, data: frontmatter } = matter(rawString);
  const transformedContent = await parseAndTransform({ content });
  const validatedFrontmatter = validateFrontmatter({
    frontmatter,
    schema,
    filepath
  });
  const filename = filepath.split("/").pop();
  if (typeof filename !== "string") {
    throw new Error("Check what went wrong");
  }
  const fileNameWithoutExtension = filename.replace(/\.[^.]*$/, "");
  return {
    slug: fileNameWithoutExtension,
    content: transformedContent,
    frontmatter: validatedFrontmatter
  };
}
async function readOne({
  directory,
  slug,
  frontmatterSchema: schema
}) {
  const filepath = path.join(contentDirectory, directory, `${slug}.md`);
  return read({
    filepath,
    schema
  });
}
async function readAll({
  directory,
  frontmatterSchema: schema
}) {
  const pathToDir = path.posix.join(contentDirectory, directory);
  const paths = await globby(`${pathToDir}/*.md`);
  return Promise.all(paths.map((path2) => read({ filepath: path2, schema })));
}

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string({
    required_error: "Required frontmatter missing: title",
    invalid_type_error: "title must be a string"
  }),
  date: z.date({
    required_error: "Required frontmatter missing: date",
    invalid_type_error: "date must be written in yyyy-mm-dd format without quotes: For example, Jan 22, 2000 should be written as 2000-01-22."
  })
});
const blog = z.discriminatedUnion("external", [
  // markdown
  baseSchema.extend({
    external: z.literal(false),
    description: z.optional(z.string()),
    ogImagePath: z.optional(z.string()),
    canonicalUrl: z.optional(z.string())
  }),
  // external link
  baseSchema.extend({
    external: z.literal(true),
    url: z.string({
      required_error: "external is true but url is missing. url must be set for posts marked as external.",
      invalid_type_error: "external should be string."
    })
  })
]);
const project = baseSchema.extend({
  url: z.string()
});

const SITE_TITLE = "기록하고 기억하기";
const SITE_DESCRIPTION = "개발자 이양래의 기록.";
const TWITTER_HANDLE = "@yourtwitterhandle";
const MY_NAME = "Rey";
const BASE_URL = new URL("http://localhost:3000");
const SITE_URL = BASE_URL.origin;

export { MY_NAME as M, SITE_TITLE as S, TWITTER_HANDLE as T, SITE_DESCRIPTION as a, SITE_URL as b, readAll as c, blog as d, project as p, readOne as r };
