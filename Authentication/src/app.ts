import express from "express";
import cors from "cors";
import AuthRoutes from "./infrastructure/routes/routes";
import TenantRoutes from "./infrastructure/routes/tenant.routes";

import { TenantMiddleware } from "./infrastructure/middleware/TenantMiddleware";
import { ReleaseDbConnection } from "./infrastructure/middleware/releaseDbconnection";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  next();
});
app.use("/tenant", TenantRoutes);
app.use(TenantMiddleware);
app.use(ReleaseDbConnection);
app.use("", AuthRoutes);

export default app;