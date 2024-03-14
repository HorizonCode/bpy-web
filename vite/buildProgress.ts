import type { PluginOption } from "vite";
import colors from "picocolors";
import { SingleBar } from "cli-progress";
import rd from "rd";
import { getCacheData, isFileExists, setCacheData } from "./cache";
import chalk from "chalk";

export default function viteProgressBar(): PluginOption {
  const { cacheTransformCount, cacheChunkCount } = getCacheData();

  let progressBar: SingleBar;
  const stream = process.stderr;
  let transformCount = 0;
  let chunkCount = 0;
  let transformed = 0;
  let fileCount = 0;
  let lastPercent = 0;
  let percent = 0;
  let errInfo: Error | undefined;

  return {
    name: "vite-plugin-progress",

    enforce: "pre",

    apply: "build",

    config(config, { command }) {
      if (command === "build") {
        config.logLevel = "silent";

        progressBar = new SingleBar({
          format: `${chalk.blue("Building source...")} ${chalk.gray("|")} ${
            chalk.red.bold("{bar}")
          } ${chalk.blue(`{percentage}%`)} ${chalk.gray("|")} ${
            chalk.blue(`{chunks}/{totalChunks} Chunks`)
          } ${chalk.gray("|")} ${
            chalk.blue(`{transformed}/{totalTransformed} Transformed`)
          }`,
          barCompleteChar: `\u2501`,
          barIncompleteChar: `\u2501`,
          barGlue: "\x1b[0m",
          hideCursor: true,
        });

        progressBar.start(100, 0, {
          chunks: chunkCount,
          totalChunks: cacheChunkCount,
          transformed: transformCount,
          totalTransformed: cacheTransformCount,
        });

        // not cache: Loop files in src directory
        if (!isFileExists) {
          const readDir = rd.readSync("src");
          const reg = /\.(vue|svelte|ts|js|jsx|tsx|css|scss|sass|styl|less)$/gi;
          readDir.forEach((item) => reg.test(item) && fileCount++);
        }
      }
    },

    transform(code, id) {
      transformCount++;

      // not cache
      if (!isFileExists) {
        const reg = /node_modules/gi;

        if (!reg.test(id) && percent < 0.25) {
          transformed++;
          percent = +(transformed / (fileCount * 2)).toFixed(2);
          percent < 0.8 && (lastPercent = percent);
        }

        if (percent >= 0.25 && lastPercent <= 0.65) {
          lastPercent = +(lastPercent + 0.001).toFixed(4);
        }
      }

      // go cache
      if (isFileExists) runCachedData();

      progressBar.update(lastPercent * 100, {
        chunks: chunkCount,
        totalChunks: cacheChunkCount,
        transformed: transformCount,
        totalTransformed: cacheTransformCount,
      });

      return {
        code,
        map: null,
      };
    },

    renderChunk() {
      chunkCount++;

      if (lastPercent <= 0.95) {
        isFileExists
          ? runCachedData()
          : (lastPercent = +(lastPercent + 0.005).toFixed(4));
      }
      progressBar.update(lastPercent * 100, {
        chunks: chunkCount,
        totalChunks: cacheChunkCount,
        transformed: transformCount,
        totalTransformed: cacheTransformCount,
      });

      return null;
    },

    // catch error info
    buildEnd(err) {
      errInfo = err;
    },

    // build completed
    closeBundle() {
      progressBar.update(100);
      progressBar.stop();
      if (!errInfo) {
        // set cache data
        setCacheData({
          cacheTransformCount: transformCount,
          cacheChunkCount: chunkCount,
        });
      } else {
        stream.write(
          `${
            colors.red(
              colors.bold(`Build failed. Please check the error message`),
            )
          }`,
        );
      }
    },
  };

  /**
   * run cache data of progress
   */
  function runCachedData() {
    transformed++;
    percent =
      lastPercent =
        +(transformed / (cacheTransformCount + cacheChunkCount)).toFixed(4);
  }
}
