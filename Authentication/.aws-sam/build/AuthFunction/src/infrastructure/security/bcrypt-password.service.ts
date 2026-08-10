import bcrypt from 'bcryptjs';
import { PasswordPort } from "../../domain/ports/password.port";

export class BcryptPasswordService implements PasswordPort {

    private readonly saltRounds = 12;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare( password, hash);
    }
}