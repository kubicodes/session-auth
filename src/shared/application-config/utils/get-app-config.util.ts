import { loadAsync } from "node-yaml-config";
import { ApplicationConfig } from "../application-config.schema";

export const getApplicationConfig = async (): Promise<ApplicationConfig> => {
    const NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV) {
        throw new Error(`Application config could not be loaded. Path: ${__dirname + "/../../../../config/${NODE_ENV}.yml"}`);
    }

    const appConfig = (await loadAsync(__dirname + `/../../../../config/${NODE_ENV}.yml`)) as ApplicationConfig;

    return appConfig;
};
