export interface ProductRequest {
    name: string,
    sku: string,
    barcode: string,
    description: string,
    category: string,
    brand: string,
    purchasePrice: number,
    salePrice: number,
    stock: number,
    minimumStock: number,
    unit: string,
    active: boolean
}

export interface ProductResponse {
    id: string,
    name: string,
    sku: string,
    barcode: string,
    description: string,
    category: string,
    brand: string,
    purchasePrice: number,
    salePrice: number,
    stock: number,
    minimumStock: number,
    unit: string,
    active: boolean
}