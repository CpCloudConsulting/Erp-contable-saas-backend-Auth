import { StylistResponse } from "../../../domain/models/stylist.models";
import { StylistRepositoryPort } from "../../../domain/ports/stylist-repository.port";

export class ListStylistUseCase {

    constructor(
        private readonly stylistPort: StylistRepositoryPort,
    ) { }

    async execute(): Promise<StylistResponse[]> {
        const res = await this.stylistPort.list();
        return res;
    }

}