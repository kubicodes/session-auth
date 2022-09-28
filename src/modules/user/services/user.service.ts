import { PrismaClient } from "@prisma/client";
import { DatabaseConnector } from "../../database-connector/services/database-connector.service";
import { UserAlreadyExistsError, UserNotFoundError } from "../schema/errors";
import { PrismaUser, User } from "../schema/user.schema";
import { hash } from "bcrypt";

export interface IUserService {
    create(username: string, password: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
}

export class UserService implements IUserService {
    private dbClient: PrismaClient;

    constructor(private dbConnector: DatabaseConnector<PrismaClient>) {
        this.dbClient = this.dbConnector.getClient();
    }

    public async create(username: string, password: string): Promise<User> {
        try {
            const existingUser = await this.dbClient.user.findUnique({ where: { username } });

            if (existingUser) {
                throw new UserAlreadyExistsError("User already exists");
            }

            const hashedPassword = await hash(password, 10);

            const createdUser = await this.dbClient.user.create({ data: { username, password: hashedPassword } });

            return this.resolveUser(createdUser);
        } catch (err) {
            throw err;
        }
    }

    public async findByUsername(username: string): Promise<User> {
        try {
            const matchingUser = await this.dbClient.user.findUnique({ where: { username } });

            if (!matchingUser) {
                throw new UserNotFoundError(`User with username: ${username} does not exist`);
            }

            return this.resolveUser(matchingUser);
        } catch (err) {
            throw new Error(`Internal Server Error while fetching user with username: ${username}`);
        }
    }

    private resolveUser(user: PrismaUser): User {
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
        };
    }
}
