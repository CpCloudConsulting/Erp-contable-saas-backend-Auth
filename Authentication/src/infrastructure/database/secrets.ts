import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

interface RdsSecret {
    username?: string;
    password?: string;
    host?: string;
    port?: number;
    dbname?: string;
}

const secretsManager = new SecretsManagerClient({});

let dbSecretPromise: Promise<RdsSecret> | undefined;

export async function getRdsSecret(): Promise<RdsSecret> {
    if (!process.env.DB_SECRET_ARN) {
        const password = process.env.DB_PASSWORD;

        if (!password) {
            throw new Error(
                "DB_PASSWORD no está configurado y DB_SECRET_ARN tampoco está definido"
            );
        }

        return {
            username: process.env.DB_USER,
            password,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT ?? 5432),
            dbname: process.env.DB_NAME,
        };
    }

    if (!dbSecretPromise) {
        dbSecretPromise = secretsManager
            .send(
                new GetSecretValueCommand({
                    SecretId: process.env.DB_SECRET_ARN,
                })
            )
            .then((result) => {
                if (!result.SecretString) {
                    throw new Error(
                        "El secreto de RDS no contiene SecretString"
                    );
                }

                const secret = JSON.parse(
                    result.SecretString
                ) as RdsSecret;

                if (!secret.password) {
                    throw new Error(
                        "El secreto de RDS no contiene password"
                    );
                }

                return secret;
            })
            .catch((error) => {
                dbSecretPromise = undefined;
                throw error;
            });
    }

    return dbSecretPromise;
}