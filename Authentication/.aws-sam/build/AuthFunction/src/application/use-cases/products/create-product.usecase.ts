import { ProductRequest } from "../../../domain/models/products.models";
import { ProductRepositoryPort } from "../../../domain/ports/product-repository.port";

export class CreateProductUseCase {

    constructor(
        private readonly productPort: ProductRepositoryPort,
    ) { }

    async execute(data: ProductRequest): Promise<boolean> {
        const res = await this.productPort.create(data);
        return res;
    }

}