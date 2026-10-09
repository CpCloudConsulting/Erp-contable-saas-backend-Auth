import { TenantResponse } from "../../../domain/models/core.models";
import { CoreRepositoryPort } from "../../../domain/ports/core-repository.port";

export class FindTenantUseCase {

    constructor(
        private readonly tenantPort: CoreRepositoryPort,
    ) { }

    async execute(subdomain: string): Promise<TenantResponse> {
        const res = await this.tenantPort.findTenant(subdomain);
        return res;
    }

}