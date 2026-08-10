import express from "express";
import cors from "cors";
import AuthRoutes from "./infrastructure/routes/routes";
import { TenantMiddleware } from "./infrastructure/middleware/TenantMiddleware";
import { ReleaseDbConnection } from "./infrastructure/middleware/releaseDbconnection";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  console.log("URL:", req.url);
  //req.url = req.url.replace(/^\/[^\/]+/, "");
  next();
});

app.use(TenantMiddleware);
app.use(ReleaseDbConnection);
app.use("/auth", AuthRoutes);

export default app;