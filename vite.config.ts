import { purgeCss } from "vite-plugin-tailwind-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type Plugin } from "vite";
import { prettytime } from "./timeUtil";
import progress from "./vite/buildProgress";

const devMiddleware: Plugin = {
  name: "log-request-middleware",
  configureServer: (server) => {
    server.middlewares.use((req, res, next) => {
      if (req.url) {
        const startTime = process.hrtime();
        let realUrl = req.url.replace(/\/__data\.json.+$/gm, "");
        if (realUrl.length <= 0) realUrl = "/";
        res.on("finish", () => {
          const elapsedHrTime = process.hrtime(startTime);
          const elapsedTimeInMs = elapsedHrTime[0] * 1000 +
            elapsedHrTime[1] / 1000000;
          const pretty = prettytime(elapsedTimeInMs, {
            short: true,
          });
          console.log(
            `[${
              new Date().toISOString()
            }] ${req.method} ${realUrl} | took ${pretty}`,
          );
        });
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [
    progress(),
    devMiddleware,
    sveltekit(),
    purgeCss({
      content: ["src/**/*.html", "src/**/*.svelte"],
      safelist: {
        greedy: [/^hljs-/],
      },
    }),
  ],
});
