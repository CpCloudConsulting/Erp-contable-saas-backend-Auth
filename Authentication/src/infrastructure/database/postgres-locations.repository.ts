
import { LocationResponse } from "../../domain/models/location.models";
import { LocationRepositoryPort } from "../../domain/ports/location.port";
import { PoolClient } from "pg";

export class PostgresLocationRepository implements LocationRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }

  async list(): Promise<LocationResponse[]> {
    const query = 'SELECT * FROM sedes';
    const result = await this.client.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      address: row.address,
      phone: row.phone,
      email: row.email,
      active: row.active,
    }));
  }

}