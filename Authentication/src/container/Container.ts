import { PoolClient } from "pg";
import { PostgresUserRepository } from "../infrastructure/database/postgres-user.repository";
import { LoginUseCase } from "../application/use-cases/login.usecase";
import { BcryptPasswordService } from "../infrastructure/security/bcrypt-password.service";
import { JwtTokenService } from "../infrastructure/security/jwt-token.service";
import { CreateUserUseCase } from "../application/use-cases/create.usecase";


export class Container {

  private readonly userRepository: PostgresUserRepository;
  private readonly passwordService: BcryptPasswordService;
  private readonly tokenService: JwtTokenService;

  public readonly doLogin: LoginUseCase;
  public readonly doCreate: CreateUserUseCase;

  constructor(client: PoolClient) {

    this.userRepository = new PostgresUserRepository(client);
    this.passwordService = new BcryptPasswordService();
    this.tokenService = new JwtTokenService();

    this.doLogin = new LoginUseCase(this.userRepository, this.passwordService, this.tokenService);
    this.doCreate = new CreateUserUseCase(this.userRepository, this.passwordService);
  }

}