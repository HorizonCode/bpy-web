import { purgeCss } from "vite-plugin-tailwind-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type Plugin } from "vite";

const devMiddleware: Plugin = {
  name: "log-request-middleware",
  configureServer: (server) => {
    server.middlewares.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  },
};

export default defineConfig({
  plugins: [
    devMiddleware,
    sveltekit(),
    purgeCss({
      safelist: {
        // any selectors that begin with "hljs-" will not be purged
        greedy: [/^hljs-/],
      },
    }),
  ],
});
