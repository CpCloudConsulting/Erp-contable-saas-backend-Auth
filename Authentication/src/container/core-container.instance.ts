import { postgresPool } from "../infrastructure/database/postgres.pool";
import { CoreContainer } from "./CoreContainer";

export const coreContainer = CoreContainer.create(postgresPool);