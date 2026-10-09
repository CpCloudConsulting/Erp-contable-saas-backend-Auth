import { StringValue } from "ms";
import { LoginRequest, LoginResponse } from "../../../domain/models/login.models";
import { PasswordPort } from "../../../domain/ports/password.port";
import { TokenPort } from "../../../domain/ports/token.port";
import { UserRepositoryPort } from "../../../domain/ports/user-repository.port";
import { SignOptions } from "jsonwebtoken";
import { CoreRepositoryPort } from "../../../domain/ports/core-repository.port";

export class LoginUseCase {

    constructor(
        private readonly userPort: UserRepositoryPort,
        private readonly passwordPort: PasswordPort,
        private readonly tokenPort: TokenPort,
        private readonly corePort: CoreRepositoryPort
    ) { }

    async execute(data: LoginRequest, schemaName: string): Promise<LoginResponse> {
        const expiresIn: SignOptions = {
            expiresIn:  process.env.JWT_EXPIRES_IN as StringValue,
        };
        const user = await this.userPort.findByUsername(data.username);

        if (!user) throw new Error("Usuario o contraseña incorrecto");
        if (!user.active) throw new Error("El usuario se encuentra inactivo");
        const validPassword = await this.passwordPort.compare(data.password, user.password);
        if (!validPassword) throw new Error("Usuario o contraseña incorrectos");
        const token = this.tokenPort.generate({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
        });

        const refreshToken = this.tokenPort.generateRefreshToken({ id: user.id, type: "refresh" });
        const companyId = await this.corePort.findCompanyId(schemaName);
        
        return {
            accessToken: token,
            refreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
            user: {
                id: user.id,
                companyId: companyId!,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        }

    }

}