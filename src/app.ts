import { ApplicationConfig, ApplicationConfigSchema } from "./shared/application-config/application-config.schema";
import { AjvSchemaValidationService } from "./shared/schema-validation/schema-validation.service";
import express from "express";
import bodyParser from "body-parser";
import UserRoutes from "./modules/auth/routes";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { getApplicationConfig } from "./shared/application-config/utils/get-app-config.util";
import cors from "cors";

(async () => {
    const app = express();

    const config: ApplicationConfig = await getApplicationConfig();
    const schemaValidationService = new AjvSchemaValidationService<ApplicationConfig>();
    const validate = schemaValidationService.getValidationFunction(ApplicationConfigSchema);

    // config validation
    if (!validate(config)) {
        console.error(JSON.stringify(validate.errors));
        throw new Error("Invalid App config");
    }
    console.log(__dirname);

    // bodyParser middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // cors and proxy
    app.set("trust proxy", 1);
    app.use(cors({ origin: config.cors ?? [], credentials: true }));

    // Redis Session storage
    const RedisStore = connectRedis(session);
    const redis = new Redis(config.redis.url);

    app.use(
        session({
            secret: config.session.secret,
            name: config.session.cookieName,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
                httpOnly: true,
                sameSite: "lax",
            },
            saveUninitialized: false,
            resave: false,
        }),
    );

    // Routes
    app.use("/user", UserRoutes);

    // App start
    app.listen(config.port, () => {
        console.log(`App listening on port: ${config.port}`);
    });
})();
