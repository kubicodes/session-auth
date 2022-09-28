import express, { Response } from "express";
import { getApplicationConfig } from "../../../shared/application-config/utils/get-app-config.util";
import { ErrorApiResponse, HttpStatusCodes } from "../../../shared/schema/api-response.schema";
import { PrismaConnector } from "../../database-connector/services/database-connector.service";
import { UserService } from "../../user/services/user.service";
import { RequestWithCustomSession } from "../schema/custom-request";
import { AuthService } from "../services/auth.service";

const router = express.Router();

router.post("/logout", async (req: RequestWithCustomSession, res: Response<{ result: boolean } | ErrorApiResponse>) => {
    const dbConnector = new PrismaConnector();
    const userService = new UserService(dbConnector);
    const appConfig = await getApplicationConfig();
    const authService = new AuthService(userService, appConfig);

    try {
        await authService.logout(req, res);

        res.status(HttpStatusCodes.SUCCESS);
        res.send({ result: true });
    } catch (err) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        res.send({ result: false, message: (err as Error).message });
    }
});

export default router;
