import dataBundle from './data-bundle';
import afaBundle from './afa-bundle';
import resultChecker from './result-checker';
import {RouteConfig, user_middleware} from "@common-server/express";
import {origen_middleware} from "@common-server/express/origin_middleware";
import {api_middleware} from "@common-server/express/api_middleware";

const buy: RouteConfig = {
    path: "/buy",
    middleware: [origen_middleware, api_middleware, user_middleware],
    children: [
        dataBundle,
        afaBundle,
        resultChecker
    ]
};

export default buy;