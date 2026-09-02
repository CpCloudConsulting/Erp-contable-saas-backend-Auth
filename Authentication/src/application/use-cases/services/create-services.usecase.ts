import { ServicesRequest } from "../../../domain/models/services.models";
import { ServicesRepositoryPort } from "../../../domain/ports/services-repository.port";

export class CreateServicesUseCase {

    constructor(
        private readonly servicesPort: ServicesRepositoryPort,
    ) { }

    async execute(data: ServicesRequest): Promise<boolean> {
        const res = await this.servicesPort.create(data);
        return res;
    }

}