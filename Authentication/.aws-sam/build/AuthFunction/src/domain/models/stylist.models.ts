export interface StylistRequest {
    name: string,
    phone: string,
    email: string,
    specialty: string,
    commission: number,
    active: boolean
}

export interface StylistResponse {
    id: string,
    name: string,
    phone: string,
    email: string,
    specialty: string,
    commission: number,
    active: boolean
}