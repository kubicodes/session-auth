import { Static, Type } from "@sinclair/typebox";

export const ApplicationConfigSchema = Type.Object({
    port: Type.Number(),
    redis: Type.Object({
        url: Type.String(),
    }),
    session: Type.Object({
        secret: Type.String(),
        cookieName: Type.String(),
    }),
    cors: Type.Optional(Type.Array(Type.String())),
});

export type ApplicationConfig = Static<typeof ApplicationConfigSchema>;
