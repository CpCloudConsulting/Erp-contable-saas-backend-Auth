import { Pool } from 'pg';
import { CoreRepositoryPort } from '../../domain/ports/core-repository.port';
import { TenantContext, TenantResponse } from '../../domain/models/core.models';

export class PostgresCoreRepository implements CoreRepositoryPort {
  constructor(
    private readonly pool: Pool,
  ) { }

  async findCompanyId(schemaName: string): Promise<string> {
    const query = 'SELECT id_company FROM core.companies WHERE schema_name = $1 AND active = true LIMIT 1';
    const result = await this.pool.query(query, [schemaName]);
    return result.rows[0]?.id_company;
  }

  async findTenant(subdomain: string): Promise<TenantResponse> {
    const query = `
      SELECT
        id_company,
        subdomain,
        commercial_name,
        logo_url,
        favicon_url,
        primary_color,
        secondary_color
      FROM core.companies
      WHERE subdomain = $1
        AND active = true
      LIMIT 1
    `;

    const result = await this.pool.query(query, [subdomain]);
    const row = result.rows[0];

    if (!row) {
      throw new Error('Tenant no encontrado');
    }

    return {
      id_company: row.id_company,
      subdomain: row.subdomain,
      commercial_name: row.commercial_name,
      logo_url: row.logo_url,
      favicon_url: row.favicon_url,
      primary_color: row.primary_color,
      secondary_color: row.secondary_color,
    };
  }

  async resolveTenant(subdomain: string): Promise<TenantContext> {
    const query = 'SELECT id_company, subdomain, schema_name FROM core.companies WHERE subdomain = $1 AND active = true LIMIT 1';
    const result = await this.pool.query(query, [subdomain]);
    const row = result.rows[0];

    if (!row) {
      throw new Error('Tenant no encontrado');
    }

   return {
      id_company: row.id_company,
      subdomain: row.subdomain,
      schema_name: row.schema_name
    };
  }
}