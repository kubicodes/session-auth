import express from "express";
import { ErrorApiResponse, HttpStatusCodes } from "../../../shared/schema/api-response.schema";
import { UserRequestBody, UserRequestBodySchema, UserWithoutPassword } from "../../user/schema/user.schema";
import { Response } from "express";
import { IUserService, UserService } from "../../user/services/user.service";
import { PrismaConnector } from "../../database-connector/services/database-connector.service";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { AuthService } from "../services/auth.service";
import { getApplicationConfig } from "../../../shared/application-config/utils/get-app-config.util";
import { CustomRequest } from "../schema/custom-request";

const router = express.Router();

router.post("/register", async (req: CustomRequest<UserRequestBody>, res: Response<UserWithoutPassword | ErrorApiResponse>) => {
    const dbConnector = new PrismaConnector();
    const userService: IUserService = new UserService(dbConnector);
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
        const createdUser = await authService.register(req.body.username, req.body.password);
        res.status(HttpStatusCodes.SUCCESS);

        req.session.userId = createdUser.id;
        res.send(createdUser);
    } catch (err) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);

        res.send({ message: (err as Error).message });
    }
});

export default router;
