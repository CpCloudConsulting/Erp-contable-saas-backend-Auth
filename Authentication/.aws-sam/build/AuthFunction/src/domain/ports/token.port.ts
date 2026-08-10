import { RefreshTokenPayload, TokenPayload } from "../models/token.models";

export interface TokenPort {
    
    generate(payload: TokenPayload): string;
    verify(token: string): TokenPayload;
    generateRefreshToken(payload: RefreshTokenPayload): string;
}