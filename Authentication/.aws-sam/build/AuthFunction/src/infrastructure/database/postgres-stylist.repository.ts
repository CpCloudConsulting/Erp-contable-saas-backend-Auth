
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
    const query = 'SELECT COUNT(*) FROM stylist WHERE email = $1';
    const result = await this.client.query(query, [email]);
    return result.rows[0].count > 0;
  }

  async create(client: StylistRequest): Promise<boolean> {
    const query = 'INSERT INTO stylists (name, phone, email, specialty, commission_percentage, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING active';
    const result = await this.client.query(query, [client.name, client.phone, client.email, client.specialty, client.commission, client.active]);
    return result.rowCount === 1;
  }

  async list(): Promise<StylistResponse[]> {
    const query = 'SELECT * FROM stylists';
    const result = await this.client.query(query);
    return result.rows;
  }

}