
import { StylistRequest, StylistResponse } from "../../domain/models/stylist.models";
import { StylistRepositoryPort } from "../../domain/ports/stylist-repository.port";
import { PoolClient } from "pg";

export class PostgresStylistRepository implements StylistRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }

  findByDocumentId(DocumentId: string): Promise<StylistResponse> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM stylists WHERE email = $1';
    const result = await this.client.query(query, [email]);
    return result.rows[0].count > 0;
  }

  async create(client: StylistRequest): Promise<boolean> {
    const query = 'SELECT core.create_stylist($1, $2, $3, $4, $5, $6, $7, $8, NULL) AS stylist_id';
    const result = await this.client.query(query, [client.companyId, client.name, client.phone, client.email, client.specialty, client.commission, client.active, client.sede]);
    return result.rows[0]?.stylist_id != null;
  }

  async list(): Promise<StylistResponse[]> {
    const query = 'SELECT * FROM stylists';
    const result = await this.client.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      specialty: row.specialty,
      commission: Number(row.commission_percentage),
      active: row.active,
    }));
  }

}