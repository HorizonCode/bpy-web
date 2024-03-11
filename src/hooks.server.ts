import { env } from "process";
import chalk from "chalk";
import knex_pkg from "knex";
const { knex } = knex_pkg;
import { config } from "dotenv";

export let database: knex_pkg.Knex;

config();

(async () => {
  try {
    console.log(chalk.gray("Connecting to database..."));
    database = knex({
      client: "mysql2",
      connection: {
        host: env.MYSQL_HOST,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
      },
    });
    await database.raw("SELECT 1 + 1 as connection_test;");
  } catch {
    console.log(
      chalk.red(
        "Could not connect to database, check your environment variables!",
      ),
    );
    process.exit(1);
  }
})();
