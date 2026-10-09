import { Pool, PoolClient } from "pg";
import { postgresPool } from "./postgres.pool";

export class PostgresAdapter {

  private readonly pool: Pool;

  constructor() {
    this.pool = postgresPool;
  }

  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  getPool(): Pool {
    return this.pool;
  }

  async query<T = any>(
    sql: string,
    params?: any[],
  ) {
    return this.pool.query<T>(
      sql,
      params,
    );
  }

  async setTenantSchema(
    client: PoolClient,
    schema: string,
  ): Promise<void> {

    const safeSchema =
      `"${schema.replace(/"/g, '""')}"`;

    await client.query(
      `SET search_path TO ${safeSchema}, public`,
    );
  }
}