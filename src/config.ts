// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "기록하고 기억하기";
export const SITE_DESCRIPTION = "개발자 이양래의 기록.";
export const TWITTER_HANDLE = "@yourtwitterhandle";
export const MY_NAME = "Rey";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
