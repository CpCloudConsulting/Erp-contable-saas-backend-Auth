import {
  Request,
  Response,
  NextFunction,
} from "express";
import { PostgresAdapter } from "../database/postgres.adapter";
import {coreContainer} from "../../container/core-container.instance";

const postgresAdapter = new PostgresAdapter();

export const TenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;

  try {

    const tenant = req.headers["x-tenant"];

    if (
      typeof tenant !== "string" ||
      !tenant.trim()
    ) {

      return res.status(400).json({
        error: "Tenant no definido",
      });
    }

    const tenantName = tenant.trim().toLowerCase();
    const tenantContext = await coreContainer.resolveTenant.execute(tenantName);
    
    client = await postgresAdapter.connect();
    await postgresAdapter.setTenantSchema(client, tenantContext.schema_name);

    req.tenantSchema = tenantContext.schema_name;
    req.dbClient = client;
    next();
  } catch (error) {
    console.error(
      "Error resolviendo tenant",
      error,
    );

    if (client) {
      client.release();
    }

    return res.status(500).json({
      error:
        "No fue posible resolver el tenant",
    });
  }
};