import { ClientRequest, ClientResponse } from "../../domain/models/client.models";
import { ClientRepositoryPort } from "../../domain/ports/client-repository.port";
import { PoolClient } from "pg";

export class PostgresClientRepository implements ClientRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }

  async findByEmail(email: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM clients WHERE email = $1';
    const result = await this.client.query(query, [email]);
    return result.rows[0].count > 0;
  }

  async create(client: ClientRequest): Promise<boolean> {
    const query = 'INSERT INTO clients (name, last_name, phone, mobile, email, marital_status, gender, birth_date, address, notes, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING active';
    const result = await this.client.query(query, [client.name, client.lastName, client.phone, client.mobilePhone, client.email, client.maritalStatus, client.gender, client.birthDate, client.address, client.notes, client.active]);
    return result.rowCount === 1;
  }

  async list(): Promise<ClientResponse[]> {
    const query = 'SELECT * FROM clients';
    const result = await this.client.query(query);
    console.log("resultado :", result);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      lastName: row.last_name,
      secondLastName: '',
      birthDate: row.birt_date,
      gender: row.gender,
      maritalStatus: row.marital_status,
      mobilePhone: row.mobile,
      phone: row.phone,
      email: row.email,
      address: row.address,
      notes: row.notes,
      clientSince: row.client_since,
      active: row.active,
    }));
  }

  async findByDocumentId(docId: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM clients WHERE document_number = $1';
    const result = await this.client.query(query, [docId]);
    return result.rows[0].count > 0;
  }

}