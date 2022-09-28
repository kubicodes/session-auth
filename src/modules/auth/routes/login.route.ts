import express, { Response } from "express";
import { getApplicationConfig } from "../../../shared/application-config/utils/get-app-config.util";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { ErrorApiResponse, HttpStatusCodes } from "../../../shared/schema/api-response.schema";
import { PrismaConnector } from "../../database-connector/services/database-connector.service";
import { UserRequestBody, UserRequestBodySchema, UserWithoutPassword } from "../../user/schema/user.schema";
import { UserService } from "../../user/services/user.service";
import { CustomRequest } from "../schema/custom-request";
import { AuthService } from "../services/auth.service";

const router = express.Router();

router.post("/login", async (req: CustomRequest<UserRequestBody>, res: Response<UserWithoutPassword | ErrorApiResponse>) => {
    const dbConnector = new PrismaConnector();
    const userService = new UserService(dbConnector);
    const appConfig = await getApplicationConfig();
    const authService = new AuthService(userService, appConfig);
    const validatorService = new AjvSchemaValidationService();
    const validateFunction = validatorService.getValidationFunction(UserRequestBodySchema);

    validateFunction(req.body);
    if (validateFunction.errors?.length) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        res.send({ message: validateFunction.errors[0].message ?? "Missing information in request body" });

        return;
    }

    try {
        const { username, password } = req.body;
        const signedInUser = await authService.login(username, password, req);

        res.status(HttpStatusCodes.SUCCESS);
        res.send(signedInUser);
    } catch (err) {
        res.send({ message: (err as Error).message });
    }
});

export default router;
