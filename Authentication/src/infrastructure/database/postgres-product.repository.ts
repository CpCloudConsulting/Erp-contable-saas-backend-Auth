import { PoolClient } from "pg";
import { ProductRepositoryPort } from "../../domain/ports/product-repository.port";
import { ProductRequest, ProductResponse } from "../../domain/models/products.models";

export class PostgresProductRepository implements ProductRepositoryPort {

  constructor(
    private readonly client: PoolClient
  ) { }

  async list(): Promise<ProductResponse[]> {
    const query = 'SELECT * FROM products';
    const result = await this.client.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      sku: row.sku,
      barcode: row.barcode,
      name: row.name,
      description: row.description,
      category: row.category,
      brand: row.brand,
      purchasePrice: Number(row.purchase_price),
      salePrice: Number(row.sale_price),
      stock: Number(row.stock),
      minimumStock: Number(row.minimum_stock),
      unit: row.unit,
      active: row.active,
    }));
  }

  async create(product: ProductRequest): Promise<boolean> {
    const query = 'INSERT INTO products (sku, barcode, name, description, category, brand, purchase_price, sale_price, stock, minimum_stock, unit, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id';
    const result = await this.client.query(query, [product.sku, product.barcode, product.name, product.description, product.category, product.brand, product.purchasePrice, product.salePrice, product.stock, product.minimumStock, product.unit, product.active]);
    return result.rowCount === 1;
  }

  async findById(docId: string): Promise<ProductResponse | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.client.query(query, [docId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      sku: row.sku,
      barcode: row.barcode,
      description: row.description,
      category: row.category,
      brand: row.brand,
      purchasePrice: Number(row.purchase_price),
      salePrice: Number(row.sale_price),
      stock: Number(row.stock),
      minimumStock: Number(row.minimum_stock),
      unit: row.unit,
      active: row.active,
    };
  }

}