import { PoolClient } from "pg";
import { PostgresUserRepository } from "../infrastructure/database/postgres-user.repository";
import { LoginUseCase } from "../application/use-cases/login/login.usecase";
import { BcryptPasswordService } from "../infrastructure/security/bcrypt-password.service";
import { JwtTokenService } from "../infrastructure/security/jwt-token.service";
import { CreateUserUseCase } from "../application/use-cases/user/create.usecase";
import { CreateClientUseCase } from "../application/use-cases/clients/create-client.usecase";
import { PostgresClientRepository } from "../infrastructure/database/postgres-client.repository";
import { CreateStylistUseCase } from "../application/use-cases/stylist/create-stylist.usecase";
import { PostgresStylistRepository } from "../infrastructure/database/postgres-stylist.repository";
import { ListStylistUseCase } from "../application/use-cases/stylist/list-stylist.usecase";


export class Container {

  private readonly userRepository: PostgresUserRepository;
  private readonly clientRepository: PostgresClientRepository;
  private readonly stylistRepository: PostgresStylistRepository;
  private readonly passwordService: BcryptPasswordService;
  private readonly tokenService: JwtTokenService;
  public readonly login: LoginUseCase;
  public readonly user: CreateUserUseCase;
  public readonly client: CreateClientUseCase;
  public readonly createStylist: CreateStylistUseCase;
  public readonly listStylist: ListStylistUseCase;

  constructor(client: PoolClient) {

    this.userRepository = new PostgresUserRepository(client);
    this.clientRepository = new PostgresClientRepository(client);
    this.stylistRepository = new PostgresStylistRepository(client);
    this.passwordService = new BcryptPasswordService();
    this.tokenService = new JwtTokenService();

    this.login = new LoginUseCase(this.userRepository, this.passwordService, this.tokenService);
    this.user = new CreateUserUseCase(this.userRepository, this.passwordService);
    this.client = new CreateClientUseCase(this.clientRepository);
    this.createStylist = new CreateStylistUseCase(this.stylistRepository);
    this.listStylist = new ListStylistUseCase(this.stylistRepository);
  }

}