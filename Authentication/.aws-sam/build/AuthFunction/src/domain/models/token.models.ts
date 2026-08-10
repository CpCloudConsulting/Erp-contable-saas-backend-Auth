export interface TokenPayload {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

export interface RefreshTokenPayload {
    id: string;
    type: string;
}