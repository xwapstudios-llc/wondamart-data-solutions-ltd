import {createExpressApp, startServer, ExpressAppConfig} from "@common-server/express";
import config from "@common-server/config";
import routes from "./routes/index"

const appConfig: ExpressAppConfig = {
    port: config.port_api,
    host: config.host_server,
    name: "api.wondamartgh.com",
    routes: [
        routes
    ]
};

const app = createExpressApp(appConfig);
startServer(app, appConfig);

