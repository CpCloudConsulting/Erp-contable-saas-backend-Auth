import { ClientResponse } from "../../../domain/models/client.models";
import { ClientRepositoryPort } from "../../../domain/ports/client-repository.port";

export class ListClientUseCase {

    constructor(
        private readonly clientPort: ClientRepositoryPort,
    ) { }

    async execute(): Promise<ClientResponse[]> {
        const res = await this.clientPort.list();
        return res;
    }

}