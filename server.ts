import express from "express";
import { handler } from "./build/handler.js";
import { config } from "dotenv";
import { prettytime } from "./timeUtil.js";

config();
(() => {
  const app = express();

  app.use((req, res, next) => {
    if (!req.url.startsWith("/_app")) {
      const startTime = process.hrtime();
      let realUrl = req.url.replace(/\/__data\.json.+$/gm, "");
      if (realUrl.length <= 0) realUrl = "/";
      res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 +
          elapsedHrTime[1] / 1000000;
        const pretty = prettytime(elapsedTimeInMs, { short: true });
        console.log(
          `[${
            new Date().toISOString()
          }] ${req.method} ${realUrl} | took ${pretty}`,
        );
      });
    }

    next();
  });

  app.use(handler);

  const host = process.env.HOST ?? "0.0.0.0";
  const port = process.env.PORT ?? 3000;

  app.listen(port as number, host, () => {
    console.log(`Listening on http://${host}:${port}`);
  });
})();
