export interface SaleItemRequest {
    type: 'service' | 'product';
    itemId: string;
    quantity: number;
}

export interface SaleRequest {
    companyId: string;
    customerId: string;
    stylistId: string;
    sedeId: string;
    paymentMethod: 'cash' | 'transfer' | 'mixed';
    discount: number;
    items: SaleItemRequest[];
}

export interface SaleResponse {

}