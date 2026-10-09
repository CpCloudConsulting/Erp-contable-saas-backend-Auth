import { SaleRequest, SaleResponse } from "../../../domain/models/sale.models";
import { SaleRepositoryPort } from "../../../domain/ports/sale-repository.port";

export class CreateSaleUseCase {

    constructor(
        private readonly salePort: SaleRepositoryPort,
    ) { }

    async execute(data: SaleRequest): Promise<SaleResponse> {
        const res = await this.salePort.create(data);
        return res;
    }

}