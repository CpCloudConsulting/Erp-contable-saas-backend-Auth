import jwt, { SignOptions } from "jsonwebtoken";
import { RefreshTokenPayload, TokenPayload } from "../../domain/models/token.models";
import { TokenPort } from "../../domain/ports/token.port";
import { StringValue } from "ms";

export class JwtTokenService implements TokenPort {

    private readonly secretKey: string;

    constructor() {
        this.secretKey = process.env.JWT_SECRET ?? '';

        if (!this.secretKey) {
            throw new Error("JWT_SECRET no está configurada");
        }
    }

    generate(payload: TokenPayload): string {
        const options: SignOptions = {
            algorithm: "HS256",
            expiresIn:  process.env.JWT_EXPIRES_IN as StringValue,
        };
        return jwt.sign(payload, this.secretKey, options);
    }

    verify(token: string): TokenPayload {
        return jwt.verify(token, this.secretKey) as TokenPayload;
    }

    generateRefreshToken(payload: RefreshTokenPayload): string {
        const options: SignOptions = {
            algorithm: "HS256",
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
        };
        return jwt.sign(payload, this.secretKey, options);
    }
}