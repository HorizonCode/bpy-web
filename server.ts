import express from "express";
import { handler } from "./build/handler.js";
import { config } from "dotenv";

config();
(() => {
  const app = express();

  app.use((req, res, next) => {
    let realUrl = req.url.replace(/\/__data\.json.+$/gm, "");
    if (realUrl.length <= 0) realUrl = "/";

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${realUrl}`,
    );
    next();
  });

  app.use(handler);

  const host = process.env.HOST ?? "0.0.0.0";
  const port = process.env.PORT ?? 3000;

  app.listen(port as number, host, () => {
    console.log(`Listening on http://${host}:${port}`);
  });
})();
