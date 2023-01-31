import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

console.log(process.env.DATABASE_URL_DEV)

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "DEV"
      ? process.env.DATABASE_URL_DEV
      : process.env.DATABASE_URL_PROD,
});

pool.connect((err, client, release) => {
  if (err) console.error("Error acquiring client", err.stack);
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) console.error("Error executing query", err.stack);
    console.log("DB Connected,", result.rows);
  });
});

export default pool;
