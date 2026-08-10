import { CreateUserEntity, UsersDTO, UsersResponse } from "../../domain/models/login.models";
import { UserRepositoryPort } from "../../domain/ports/user-repository.port";
import { PoolClient } from "pg";

export class PostgresUserRepository implements UserRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }


  async findByEmail(email: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
    const result = await this.client.query(query, [email]);
    return result.rows[0].count > 0;
  }

  async create(user: CreateUserEntity, hash: string): Promise<UsersResponse> {
    const query = 'INSERT INTO users ( username, email, password_hash, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id_user, username, email, name, phone, active';
    const result = await this.client.query(query, [user.username, user.email, hash, user.name, user.phone]);
    const row = result.rows[0];
    return {
      id: row.id_user,
      email: row.email,
      username: row.username,
      active: row.active,
      name: row.name,
      phone: row.phone,
    };
  }

  async findByUsername(username: string): Promise<UsersDTO | null> {
    const query = `
    SELECT
      u.id_user,
      u.username,
      u.email,
      u.password_hash,
      u.active,
      u.name,
      ARRAY_AGG(r.name ORDER BY r.name) AS roles
    FROM users u
    INNER JOIN user_roles ur
      ON ur.id_user = u.id_user
    INNER JOIN roles r
      ON r.id_role = ur.id_role
    WHERE u.username = $1
    GROUP BY
      u.id_user,
      u.username,
      u.email,
      u.password_hash,
      u.active,
      u.name;
  `;

    const result = await this.client.query(query, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id_user,
      email: row.email,
      password: row.password_hash,
      active: row.active,
      name: row.name,
      roles: row.roles
    };
  }

}