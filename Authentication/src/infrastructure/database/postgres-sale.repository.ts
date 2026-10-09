import { PoolClient } from "pg";
import { SaleRepositoryPort } from "../../domain/ports/sale-repository.port";
import { SaleRequest, SaleResponse } from "../../domain/models/sale.models";

export class PostgresSaleRepository implements SaleRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }


  async create(Sale: SaleRequest): Promise<SaleResponse> {
    const itemValues = Sale.items
      .map(
        (_, index) =>
          `ROW($${index * 3 + 7}::varchar, $${index * 3 + 8}::uuid, $${index * 3 + 9}::numeric)::core.sale_item_input`
      )
      .join(', ');

    const itemParams = Sale.items.flatMap((item) => [
      item.type,
      item.itemId,
      item.quantity,
    ]);

    const query = `
    SELECT core.create_sale(
      $1::uuid,
      $2::uuid,
      $3::uuid,
      $4::varchar,
      $5::numeric,
      ARRAY[
        ${itemValues}
      ]::core.sale_item_input[]
    ) AS sale;
  `;

    const result = await this.client.query(query, [
      Sale.companyId,
      Sale.customerId,
      Sale.stylistId,
      Sale.paymentMethod,
      Sale.discount,
      ...itemParams,
    ]);

    return result.rows[0].sale;
  }

}