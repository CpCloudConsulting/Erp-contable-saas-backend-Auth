import { Pool } from "pg";
import { PostgresCoreRepository } from "../infrastructure/database/postgres-core.repository";
import { FindTenantUseCase } from "../application/use-cases/tenant/find-tenat.usecase";
import { ResolveTenantUseCase } from "../application/use-cases/tenant/resolve-tenant.usecase";

export class CoreContainer {
  public readonly findTenant: FindTenantUseCase;
  public readonly resolveTenant: ResolveTenantUseCase;

  private constructor(
    findTenant: FindTenantUseCase,
    resolveTenant: ResolveTenantUseCase,
  ) {

    this.findTenant = findTenant;
    this.resolveTenant = resolveTenant;
  }

  static create(pool: Pool): CoreContainer {

    const coreRepository = new PostgresCoreRepository(pool);
    const findTenant = new FindTenantUseCase(coreRepository);
    const resolveTenant = new ResolveTenantUseCase(coreRepository);

    return new CoreContainer(
      findTenant,
      resolveTenant,
    );
  }
}