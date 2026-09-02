import "../../config/env";
import { Pool, PoolClient, QueryResult } from "pg";

export class PostgresAdapter {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT ?? 5432),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            ssl:
                process.env.DB_SSL === "true"
                    ? { rejectUnauthorized: false }
                    : false,
        });

        this.pool.on("error", (error) => {
            console.error(
                "PostgreSQL pool error",
                error
            );
        });
    }

    async query<T = any>(
        sql: string,
        params?: any[]
    ): Promise<QueryResult<T>> {
        return this.pool.query<T>(sql, params);
    }

    async connect(): Promise<PoolClient> {
        return this.pool.connect();
    }

    getPool(): Pool {
        return this.pool;
    }

    async close(): Promise<void> {
        await this.pool.end();
    }

    private quoteIdentifier(value: string): string {
        return `"${value.replace(/"/g, '""')}"`;
    }

    async setTenantSchema(
        client: PoolClient,
        schema: string
    ): Promise<void> {
        const safeSchema = this.quoteIdentifier(schema);
        await client.query(
            `SET search_path TO ${safeSchema}, public`
        );
    }
}