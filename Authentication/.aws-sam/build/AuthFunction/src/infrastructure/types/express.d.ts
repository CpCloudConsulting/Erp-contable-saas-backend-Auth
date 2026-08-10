import { PoolClient } from "pg";

declare global {
    namespace Express {
        interface Request {
            tenantSchema?: string;
            dbClient?: PoolClient;
        }
    }
}

export {};