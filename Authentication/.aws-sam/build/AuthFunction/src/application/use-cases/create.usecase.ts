import { CreateUserEntity, UsersResponse } from "../../domain/models/login.models";
import { PasswordPort } from "../../domain/ports/password.port";
import { UserRepositoryPort } from "../../domain/ports/user-repository.port";

export class CreateUserUseCase {

    constructor(
        private readonly userPort: UserRepositoryPort,
        private readonly passwordPort: PasswordPort,
    ) { }

    async execute(data: CreateUserEntity): Promise<UsersResponse> {
        const user = await this.userPort.findByUsername(data.username);
        if (!user) throw new Error("Nombre de usuario ya existe");

        const email = await this.userPort.findByEmail(data.email);
        if (!email) throw new Error("Email ya registrado");

        const pass_hash = await this.passwordPort.hash(data.password);

        const res = await this.userPort.create(data, pass_hash);
        return res;
    }

}