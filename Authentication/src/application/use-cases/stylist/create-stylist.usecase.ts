import { StylistRequest } from "../../../domain/models/stylist.models";
import { StylistRepositoryPort } from "../../../domain/ports/stylist-repository.port";

export class CreateStylistUseCase {

    constructor(
        private readonly stylistPort: StylistRepositoryPort,
    ) { }

    async execute(data: StylistRequest): Promise<boolean> {
        const email = await this.stylistPort.findByEmail(data.email);
        if (email) throw new Error("Email ya registrado");

        const res = await this.stylistPort.create(data);
        return res;
    }

}