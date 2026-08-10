import {
  Request,
  Response,
  NextFunction
} from "express";

import { PostgresAdapter } from "../database/postgres.adapter";

const postgresAdapter = new PostgresAdapter();

export const TenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let client;

  try {

    const schema = req.headers["x-schema"] as string;

    if (!schema) {

      return res.status(400).json({
        error: "Schema no definido"
      });
    }

    client = await postgresAdapter.connect();

    await postgresAdapter.setTenantSchema(
      client,
      schema
    );

    req.tenantSchema = schema;
    req.dbClient = client;
    next();

  } catch (error: any) {

    console.error("TENANT ERROR:", error);
    if (client) {
      client.release();
    }

    return res.status(500).json({
      error: "No fue posible configurar el tenant"
    });
  }
};