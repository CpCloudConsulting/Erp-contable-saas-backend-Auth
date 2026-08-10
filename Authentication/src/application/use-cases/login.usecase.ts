import { StringValue } from "ms";
import { LoginRequest, LoginResponse } from "../../domain/models/login.models";
import { PasswordPort } from "../../domain/ports/password.port";
import { TokenPort } from "../../domain/ports/token.port";
import { UserRepositoryPort } from "../../domain/ports/user-repository.port";
import { SignOptions } from "jsonwebtoken";


export class LoginUseCase {

    constructor(
        private readonly userPort: UserRepositoryPort,
        private readonly passwordPort: PasswordPort,
        private readonly tokenPort: TokenPort
    ) { }

    async execute(data: LoginRequest): Promise<LoginResponse> {
        const expiresIn: SignOptions = {
            expiresIn:  process.env.JWT_EXPIRES_IN as StringValue,
        };
        const user = await this.userPort.findByUsername(data.username);
        console.log("usuario : ---> " , user);
        if (!user) throw new Error("Usuario o contraseña incorrecto");
        if (!user.active) throw new Error("El usuario se encuentra inactivo");
        
        const validPassword = await this.passwordPort.compare(data.password, user.password);
        if (!validPassword) throw new Error("Usuario o contraseña incorrectos");
        console.log('validPassword : --->', validPassword );
        const token = this.tokenPort.generate({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
        });

        console.log('token : --->', token );

        const refreshToken = this.tokenPort.generateRefreshToken({ id: user.id, type: "refresh" });
        console.log('refresh token : --->', refreshToken);
        return {
            accessToken: token,
            refreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        }

    }

}