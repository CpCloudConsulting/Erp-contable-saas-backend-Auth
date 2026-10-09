import "../../config/env";

import { Pool } from "pg";
import { getRdsSecret } from "./secrets";

export const postgresPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: async () => {
    const secret = await getRdsSecret();
    return secret.password!;
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

postgresPool.on("error", (error) => {
  console.error(
    "PostgreSQL pool error",
    error,
  );
});