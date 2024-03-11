import { env } from "process";
import chalk from "chalk";
import knex_pkg from "knex";
import redis from "redis";
const { knex } = knex_pkg;
import { config } from "dotenv";

export let mysqlDatabase: knex_pkg.Knex;
export let redisClient: redis.RedisClientType<
  redis.RedisDefaultModules & redis.RedisModules,
  redis.RedisFunctions,
  redis.RedisScripts
>;

config();

(async () => {
  return;
  const redisUser = env.REDIS_USER ?? undefined;
  const redisPassword = env.REDIS_PASSWORD ?? undefined;
  const redisHost = env.REDIS_HOST ?? "127.0.0.1";
  const redisPort = env.REDIS_PORT ?? 6379;
  const redisDb = env.REDIS_DB ?? 0;

  //do regex check if redisDb is a valid number
  if (/^\d+$/.test(redisDb.toString()) === false) {
    console.log(chalk.red("Invalid Redis DB!"));
    process.exit(1);
  }

  let redisUrl = "redis://";

  if (redisUser && redisPassword) {
    redisUrl += `${redisUser}:${redisPassword}@`;
  }

  redisUrl += `${redisHost}:${redisPort}`;

  try {
    console.log(chalk.gray("Connecting to Redis..."));
    redisClient = await redis.createClient({
      url: redisUrl,
      database: redisDb as number,
    }).on("error", (error) => {
      if (error.code === "ECONNREFUSED") {
        console.log(chalk.red("Could not connect to Redis!"));
        process.exit(1);
      } else {
        console.log(chalk.red("Unknown Redis error!"));
        process.exit(1);
      }
    })
      .connect();

    try {
      await redisClient.ping();
      console.log(chalk.green("Connected to Redis!"));
    } catch {
      console.log(chalk.red("Could not connect to Redis!"));
      process.exit(1);
    }

    console.log(chalk.gray("Connecting to MySQL database..."));
    mysqlDatabase = knex({
      client: "mysql2",
      connection: {
        host: env.MYSQL_HOST,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
      },
    });
    await mysqlDatabase.raw("SELECT 1 + 1 as connection_test;");
    console.log(chalk.green("Connected to MySQL database!"));
  } catch {
    console.log(
      chalk.red(
        "Could not connect to database, check your environment variables!",
      ),
    );
    process.exit(1);
  }
})();
