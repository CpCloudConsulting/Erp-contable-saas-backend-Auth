import { CreateRolesEntity, RolesResponse } from "../../domain/models/login.models";
import { RolesRepositoryPort } from "../../domain/ports/roles-repository.port";
import { PoolClient } from "pg";

export class PostgresUserRepository implements RolesRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }


  async findByRolename(name: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM roles WHERE name = $1';
    const result = await this.client.query(query, [name]);
    return result.rows[0].count > 0;
  }

  async assignRoles(userId: string, roles: string[]): Promise<void> {
    const query = 'INSERT INTO user_roles (id_user, id_role) SELECT $1, UNNEST($2::uuid[])';
    await this.client.query(query, [userId,roles]);
  }

  async create(roles: CreateRolesEntity): Promise<RolesResponse> {
    const query = 'INSERT INTO roles (name, description) VALUES ( $1, $2 ) RETURNING id_role, name, description';
    const result = await this.client.query(query, [roles.name, roles.description]);
    const row = result.rows[0];
    return {
      id: row.id_role,
      name: row.name,
      description: row.description
    };
  }

}