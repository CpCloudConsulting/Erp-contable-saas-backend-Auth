import { ClientRequest } from "../../../domain/models/client.models";
import { ClientRepositoryPort } from "../../../domain/ports/client-repository.port";

export class CreateClientUseCase {

    constructor(
        private readonly clientPort: ClientRepositoryPort,
    ) { }

    async execute(data: ClientRequest): Promise<boolean> {
        const email = await this.clientPort.findByEmail(data.email);
        if (email) throw new Error("Email ya registrado");

        const res = await this.clientPort.create(data);
        return res;
    }

}