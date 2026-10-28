export interface ServicesRequest {
    companyId: string,
    sedeId: string,
    name: string,
    description: string,
    durationMinutes: number,
    price: number,
    commission: number,
    active: boolean
}

export interface ServicesResponse {
    id: string,
    name: string,
    description: string,
    durationMinutes: number,
    price: number,
    commission: number,
    active: boolean
}