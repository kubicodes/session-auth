import { Static, Type } from "@sinclair/typebox";

export interface PrismaUser {
    id: number;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
}
export const UserSchema = Type.Object({
    id: Type.Number(),
    username: Type.String(),
    password: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.Optional(Type.String()),
});

export type User = Static<typeof UserSchema>;
export type UserWithoutPassword = Omit<User, "password">;

export const UserRequestBodySchema = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

export type UserRequestBody = Static<typeof UserRequestBodySchema>;
