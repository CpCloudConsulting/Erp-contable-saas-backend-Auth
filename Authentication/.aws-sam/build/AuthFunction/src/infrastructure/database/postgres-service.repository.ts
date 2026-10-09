import { PoolClient } from "pg";
import { ServicesRepositoryPort } from "../../domain/ports/services-repository.port";
import { ServicesRequest, ServicesResponse } from "../../domain/models/services.models";

export class PostgresServiceRepository implements ServicesRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }

  async list(): Promise<ServicesResponse[]> {
    const query = 'SELECT * FROM services';
    const result = await this.client.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      durationMinutes: Number(row.duration_minutes),
      price: Number(row.price),
      commission: Number(row.commission_percentage),
      active: row.active,
    }));
  }


  async create(service: ServicesRequest): Promise<boolean> {
    const query = 'INSERT INTO services (name, description, duration_minutes, price, commission_percentage, active) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING id';
    const result = await this.client.query(query, [service.name, service.description, service.durationMinutes, service.price, service.commission, service.active]);
    return result.rowCount === 1;
  }

  async findById(id: string): Promise<ServicesResponse | null> {
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await this.client.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      durationMinutes: Number(row.duration_minutes),
      price: Number(row.price),
      commission: Number(row.commission),
      active: row.active
    };
  }

}