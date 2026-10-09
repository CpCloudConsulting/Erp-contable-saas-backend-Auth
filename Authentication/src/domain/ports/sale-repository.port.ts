import { SaleRequest, SaleResponse } from "../models/sale.models";

export interface SaleRepositoryPort {

  create(data: SaleRequest): Promise<SaleResponse>;
}