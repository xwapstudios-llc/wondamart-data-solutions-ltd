import {createExpressApp, startServer, ExpressAppConfig} from "@common-server/express";
import config from "@common-server/config";
import routes from "./routes/index"
import {allow_all_origins_middleware} from "@common-server/express/origin_middleware";

const appConfig: ExpressAppConfig = {
    port: config.port_api,
    host: config.host_server,
    name: "api.wondamartgh.com",
    middleware: [allow_all_origins_middleware],
    routes: [
        routes
    ]
};

const app = createExpressApp(appConfig);
startServer(app, appConfig);

