import { ProductRequest, ProductResponse } from "../models/products.models";

export interface ProductRepositoryPort {

  create(client: ProductRequest): Promise<boolean>;
  list(): Promise<ProductResponse[]>;
  findById(Id: string): Promise<ProductResponse | null>;
}