export interface TenantResponse {
  id_company: string;
  subdomain: string;
  commercial_name: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
}

export interface TenantContext {
  id_company: string;
  subdomain: string;
  schema_name: string;
}