import { compare } from "bcrypt";
import { ApplicationConfig } from "../../../shared/application-config/application-config.schema";
import { UserRequestBody, UserWithoutPassword } from "../../user/schema/user.schema";
import { IUserService } from "../../user/services/user.service";
import { AlreadyAuthenticatedError, InvalidPasswordError, NotAuthenticated } from "../schema/auth-errors";
import { Response } from "express";
import { CustomRequest, RequestWithCustomSession } from "../schema/custom-request";

export interface IAuthService {
    register(username: string, password: string): Promise<UserWithoutPassword>;
    login(username: string, password: string, req: CustomRequest<UserRequestBody>): Promise<UserWithoutPassword>;
    logout(req: RequestWithCustomSession, res: Response): Promise<boolean>;
}

export class AuthService implements IAuthService {
    constructor(private userService: IUserService, private appConfig: ApplicationConfig) {}

    public async register(username: string, password: string): Promise<UserWithoutPassword> {
        try {
            const createdUser = await this.userService.create(username, password);

            return {
                id: createdUser.id,
                username: createdUser.username,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
            };
        } catch (err) {
            throw err;
        }
    }

    public async login(username: string, password: string, req: CustomRequest<UserRequestBody>): Promise<UserWithoutPassword> {
        try {
            if (req.session.userId) {
                throw new AlreadyAuthenticatedError(`User ${username} is already logged in`);
            }

            const matchingUser = await this.userService.findByUsername(username);

            const isPasswordCorrect = await compare(password, matchingUser.password);
            if (!isPasswordCorrect) {
                throw new InvalidPasswordError("Wrong Password");
            }

            req.session.userId = matchingUser.id;

            return {
                id: matchingUser.id,
                username: matchingUser.username,
                createdAt: matchingUser.createdAt,
                updatedAt: matchingUser.updatedAt,
            };
        } catch (err) {
            throw err;
        }
    }

    public async logout(req: RequestWithCustomSession, res: Response): Promise<boolean> {
        if (!req.session.userId) {
            throw new NotAuthenticated("Not authenticated!");
        }

        return new Promise((resolve, reject) => {
            req.session.destroy((err: Error) => {
                res.clearCookie(this.appConfig.session.cookieName);

                if (err) {
                    reject(false);
                    throw err;
                }

                resolve(true);
            });
        });
    }
}
