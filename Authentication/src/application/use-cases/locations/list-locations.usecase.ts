import { LocationResponse } from "../../../domain/models/location.models";
import { LocationRepositoryPort } from "../../../domain/ports/location.port";

export class ListLocationsUseCase {

    constructor(
        private readonly locationPort: LocationRepositoryPort,
    ) { }

    async execute(): Promise<LocationResponse[]> {
        const res = await this.locationPort.list();
        return res;
    }

}