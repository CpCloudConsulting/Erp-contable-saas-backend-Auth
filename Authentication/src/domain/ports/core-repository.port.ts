import { TenantContext, TenantResponse } from "../models/core.models";

export interface CoreRepositoryPort {

  findCompanyId(schemaName: string): Promise<string>;
  findTenant(subdomain: string): Promise<TenantResponse>;
  resolveTenant(subdomain: string): Promise<TenantContext>;
}