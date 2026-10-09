import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

interface JwtSecret {
    JWT_SECRET: string;
}

export class JwtSecretProvider {
    private readonly client: SecretsManagerClient;

    constructor() {
        this.client = new SecretsManagerClient({
            region: process.env.AWS_REGION,
        });
    }

    async getSecret(): Promise<string> {
        // Desarrollo local
        if (!process.env.JWT_SECRET_ARN) {
            const secret = process.env.JWT_SECRET;

            if (!secret) {
                throw new Error(
                    'JWT_SECRET no está configurado y JWT_SECRET_ARN tampoco está definido',
                );
            }

            return secret;
        }

        // AWS Secrets Manager
        const command = new GetSecretValueCommand({
            SecretId: process.env.JWT_SECRET_ARN,
        });

        const response = await this.client.send(command);

        if (!response.SecretString) {
            throw new Error(
                'El secreto JWT no contiene SecretString',
            );
        }

        let secret: JwtSecret;

        try {
            secret = JSON.parse(response.SecretString);
        } catch {
            throw new Error(
                'El secreto JWT no contiene un JSON válido',
            );
        }

        if (!secret.JWT_SECRET) {
            throw new Error(
                'El secreto JWT no contiene JWT_SECRET',
            );
        }

        return secret.JWT_SECRET;
    }
}