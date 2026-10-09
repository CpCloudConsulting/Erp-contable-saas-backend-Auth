import { TenantContext } from "../../../domain/models/core.models";
import { CoreRepositoryPort } from "../../../domain/ports/core-repository.port";

export class ResolveTenantUseCase {
  constructor(
    private readonly tenantPort: CoreRepositoryPort,
  ) {}

  async execute(subdomain: string): Promise<TenantContext> {
    return this.tenantPort.resolveTenant(subdomain);
  }
}