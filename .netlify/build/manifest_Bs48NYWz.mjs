import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, g as decodeKey } from './chunks/astro/server_kHpqL8PH.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = (ctx, next) => {
  ctx.request.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return next();
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/leche/Desktop/github/blog/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DWp0T_i_.js"}],"styles":[{"type":"external","src":"/_astro/blog.CRWr8o_T.css"},{"type":"external","src":"/_astro/_slug_.BcyuIoXx.css"},{"type":"external","src":"/_astro/_slug_.DSmQFT6J.css"}],"routeData":{"route":"/blog/[slug]","isIndex":false,"type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/[slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DVmRJP6N.js"}],"styles":[{"type":"external","src":"/_astro/blog.CRWr8o_T.css"},{"type":"external","src":"/_astro/_slug_.BcyuIoXx.css"},{"type":"inline","content":"body{display:grid;grid-template-areas:\"header\" \"main\" \"footer\";grid-template-rows:5rem minmax(0,1fr) 5rem;grid-template-columns:minmax(0,1fr)}main[data-astro-cid-3zbxo6iv]{grid-area:main}\n"}],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DVmRJP6N.js"}],"styles":[{"type":"external","src":"/_astro/blog.CRWr8o_T.css"},{"type":"external","src":"/_astro/_slug_.BcyuIoXx.css"},{"type":"inline","content":"body{display:grid;grid-template-areas:\"header\" \"main\" \"footer\";grid-template-rows:5rem minmax(0,1fr) 5rem;grid-template-columns:minmax(0,1fr)}main[data-astro-cid-3zbxo6iv]{grid-area:main}\n"}],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DVmRJP6N.js"}],"styles":[{"type":"external","src":"/_astro/blog.CRWr8o_T.css"},{"type":"external","src":"/_astro/_slug_.BcyuIoXx.css"},{"type":"inline","content":"body{display:grid;grid-template-areas:\"header\" \"main\" \"footer\";grid-template-rows:5rem minmax(0,1fr) 5rem;grid-template-columns:minmax(0,1fr)}main[data-astro-cid-3zbxo6iv]{grid-area:main}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"http://localhost:3000","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/leche/Desktop/github/blog/src/pages/blog/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/leche/Desktop/github/blog/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["/Users/leche/Desktop/github/blog/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/leche/Desktop/github/blog/src/pages/projects.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bs48NYWz.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.DWp0T_i_.js","/astro/hoisted.js?q=1":"_astro/hoisted.DVmRJP6N.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.BcyuIoXx.css","/_astro/_slug_.DSmQFT6J.css","/_astro/blog.CRWr8o_T.css","/favicon.ico","/_astro/hoisted.DVmRJP6N.js","/_astro/hoisted.DWp0T_i_.js","/fonts/roboto-mono-v22-latin-700.woff","/fonts/roboto-mono-v22-latin-700.woff2","/fonts/roboto-mono-v22-latin-italic.woff","/fonts/roboto-mono-v22-latin-italic.woff2","/fonts/roboto-mono-v22-latin-regular.woff","/fonts/roboto-mono-v22-latin-regular.woff2","/images/blogster.png","/images/og.png","/fontawesome/webfonts/fa-brands-400.ttf","/fontawesome/webfonts/fa-brands-400.woff2","/fontawesome/webfonts/fa-regular-400.ttf","/fontawesome/webfonts/fa-regular-400.woff2","/fontawesome/webfonts/fa-solid-900.ttf","/fontawesome/webfonts/fa-solid-900.woff2","/fontawesome/webfonts/fa-v4compatibility.ttf","/fontawesome/webfonts/fa-v4compatibility.woff2","/fontawesome/css/all.css","/fontawesome/css/all.min.css","/fontawesome/css/brands.bareminimum.css","/fontawesome/css/brands.css","/fontawesome/css/brands.min.css","/fontawesome/css/fontawesome.bareminimum.css","/fontawesome/css/fontawesome.css","/fontawesome/css/fontawesome.min.css","/fontawesome/css/regular.css","/fontawesome/css/regular.min.css","/fontawesome/css/solid.css","/fontawesome/css/solid.min.css","/fontawesome/css/svg-with-js.css","/fontawesome/css/svg-with-js.min.css","/fontawesome/css/v4-font-face.css","/fontawesome/css/v4-font-face.min.css","/fontawesome/css/v4-shims.css","/fontawesome/css/v4-shims.min.css","/fontawesome/css/v5-font-face.css","/fontawesome/css/v5-font-face.min.css"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"lQLnZL2Jv6bWK7CS0c2sr7GxxWbY15gcKHj5XHHTs0M=","experimentalEnvGetSecretEnabled":false});

export { manifest };
