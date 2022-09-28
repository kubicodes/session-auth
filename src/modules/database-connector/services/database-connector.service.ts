import { PrismaClient } from "@prisma/client";

export interface DatabaseConnector<T> {
    getClient(): T;
}

export class PrismaConnector implements DatabaseConnector<PrismaClient> {
    private dbClient: PrismaClient;

    getClient(): PrismaClient {
        if (this.dbClient) {
            return this.dbClient;
        }
        
        return new PrismaClient();
    }
}
