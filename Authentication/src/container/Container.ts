import { PoolClient } from "pg";

import { PostgresUserRepository } from "../infrastructure/database/postgres-user.repository";
import { LoginUseCase } from "../application/use-cases/login/login.usecase";

import { BcryptPasswordService } from "../infrastructure/security/bcrypt-password.service";
import { JwtTokenService } from "../infrastructure/security/jwt-token.service";
import { JwtSecretProvider } from "../infrastructure/security/jwt-secret";

import { CreateUserUseCase } from "../application/use-cases/user/create.usecase";

import { CreateClientUseCase } from "../application/use-cases/clients/create-client.usecase";
import { ListClientUseCase } from "../application/use-cases/clients/list-client.usecase";
import { PostgresClientRepository } from "../infrastructure/database/postgres-client.repository";

import { CreateStylistUseCase } from "../application/use-cases/stylist/create-stylist.usecase";
import { ListStylistUseCase } from "../application/use-cases/stylist/list-stylist.usecase";
import { PostgresStylistRepository } from "../infrastructure/database/postgres-stylist.repository";

import { PostgresProductRepository } from "../infrastructure/database/postgres-product.repository";
import { CreateProductUseCase } from "../application/use-cases/products/create-product.usecase";
import { ListProductUseCase } from "../application/use-cases/products/list-product.usecase";

import { PostgresServiceRepository } from "../infrastructure/database/postgres-service.repository";
import { CreateServicesUseCase } from "../application/use-cases/services/create-services.usecase";
import { ListServicesUseCase } from "../application/use-cases/services/list-services.usecase";

import { CreateSaleUseCase } from "../application/use-cases/sale/create-sale.usecase";
import { PostgresSaleRepository } from "../infrastructure/database/postgres-sale.repository";

import { PostgresCoreRepository } from "../infrastructure/database/postgres-core.repository";
import { FindTenantUseCase } from "../application/use-cases/tenant/find-tenat.usecase";
import { PostgresLocationRepository } from "../infrastructure/database/postgres-locations.repository";
import { ListLocationsUseCase } from "../application/use-cases/locations/list-locations.usecase";


export class Container {

  private readonly userRepository: PostgresUserRepository;
  private readonly clientRepository: PostgresClientRepository;
  private readonly stylistRepository: PostgresStylistRepository;
  private readonly productRepository: PostgresProductRepository;
  private readonly serviceRepository: PostgresServiceRepository;
  private readonly locationRepository: PostgresLocationRepository;
  private readonly saleRepository: PostgresSaleRepository;

  private readonly passwordService: BcryptPasswordService;
  private readonly tokenService: JwtTokenService;

  private readonly coreRepository: PostgresCoreRepository;

  public readonly login: LoginUseCase;
  public readonly user: CreateUserUseCase;
  public readonly client: CreateClientUseCase;
  public readonly createStylist: CreateStylistUseCase;
  public readonly listStylist: ListStylistUseCase;
  public readonly createProduct: CreateProductUseCase;
  public readonly listProduct: ListProductUseCase;
  public readonly createService: CreateServicesUseCase;
  public readonly listService: ListServicesUseCase;
  public readonly listClients: ListClientUseCase;
  public readonly createSale: CreateSaleUseCase;
  public readonly getTenant: FindTenantUseCase;
  public readonly listLocations: ListLocationsUseCase;


  private constructor(
    client: PoolClient,
    tokenService: JwtTokenService,
  ) {

    // Repositories por request
    this.userRepository = new PostgresUserRepository(client);
    this.clientRepository = new PostgresClientRepository(client);
    this.stylistRepository = new PostgresStylistRepository(client);
    this.productRepository = new PostgresProductRepository(client);
    this.serviceRepository = new PostgresServiceRepository(client);
    this.saleRepository = new PostgresSaleRepository(client);
    this.locationRepository = new PostgresLocationRepository(client);

    // Servicios
    this.passwordService = new BcryptPasswordService();

    // JWT reutilizable
    this.tokenService = tokenService;

    // Core
    this.coreRepository = new PostgresCoreRepository(client);

    // Use Cases
    this.login = new LoginUseCase(
      this.userRepository,
      this.passwordService,
      this.tokenService,
      this.coreRepository,
    );

    this.user = new CreateUserUseCase(
      this.userRepository,
      this.passwordService,
    );

    this.client = new CreateClientUseCase(
      this.clientRepository,
    );

    this.createStylist = new CreateStylistUseCase(
      this.stylistRepository,
    );

    this.listStylist = new ListStylistUseCase(
      this.stylistRepository,
    );

    this.createProduct = new CreateProductUseCase(
      this.productRepository,
    );

    this.listProduct = new ListProductUseCase(
      this.productRepository,
    );

    this.createService = new CreateServicesUseCase(
      this.serviceRepository,
    );

    this.listService = new ListServicesUseCase(
      this.serviceRepository,
    );

    this.listClients = new ListClientUseCase(
      this.clientRepository,
    );

    this.createSale = new CreateSaleUseCase(
      this.saleRepository,
    );

    this.getTenant = new FindTenantUseCase(
      this.coreRepository,
    );

    this.listLocations = new ListLocationsUseCase(
      this.locationRepository,
    );

  }

  private static jwtTokenService: JwtTokenService | null = null;

  private static async getTokenService(): Promise<JwtTokenService> {

    if (Container.jwtTokenService) {
      return Container.jwtTokenService;
    }

    const jwtSecretProvider = new JwtSecretProvider();
    const jwtSecret = await jwtSecretProvider.getSecret();
    Container.jwtTokenService = new JwtTokenService(jwtSecret);
    return Container.jwtTokenService;
  }

  public static async create(
    client: PoolClient,
  ): Promise<Container> {

    const tokenService = await Container.getTokenService();

    return new Container(
      client,
      tokenService,
    );
  }
}