import { ServicesResponse } from "../../../domain/models/services.models";
import { ServicesRepositoryPort } from "../../../domain/ports/services-repository.port";

export class ListServicesUseCase {

    constructor(
        private readonly servicesPort: ServicesRepositoryPort,
    ) { }

    async execute(): Promise<ServicesResponse[]> {
        const res = await this.servicesPort.list();
        return res;
    }

}