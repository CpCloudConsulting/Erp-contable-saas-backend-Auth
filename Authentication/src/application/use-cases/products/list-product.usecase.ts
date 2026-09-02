import { ProductResponse } from "../../../domain/models/products.models";
import { ProductRepositoryPort } from "../../../domain/ports/product-repository.port";

export class ListProductUseCase {

    constructor(
        private readonly productPort: ProductRepositoryPort,
    ) { }

    async execute(): Promise<ProductResponse[]> {
        const res = await this.productPort.list();
        return res;
    }

}