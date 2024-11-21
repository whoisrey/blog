import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

const SERVER_PORT = 3000;
const BASE_URL = "https://devrey.blog";

export default defineConfig({
  server: {
    port: SERVER_PORT,
  },
  site: BASE_URL,
  integrations: [
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
  ],
  output: "static",
  adapter: netlify(),
});
