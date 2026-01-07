import { Request, Response, NextFunction } from "express";
import { HTTPResponse } from "@common/types/request";

export interface MiddlewareHandler {
    (req: Request, res: Response, next: NextFunction): Promise<void> | void | any;
}

export interface RouteHandler {
    (req: Request, res: Response, next?: NextFunction): Promise<void> | void;
}

interface OpenApiMeta {
    summary?: string;
    description?: string;
    tags?: string[];
    operationId?: string;

    requestBody?: any;   // JSON Schema (v3)
    responses?: Record<string, any>;
}

type MethodConfig = RouteHandler | {
    handler: RouteHandler;
    middleware?: MiddlewareHandler[];
    openapi?: OpenApiMeta;
}

export interface RouteConfig {
    path: string;
    middleware?: MiddlewareHandler[];
    get?: MethodConfig,
    post?: MethodConfig,
    put?: MethodConfig,
    delete?: MethodConfig,
    patch?: MethodConfig,
    children?: RouteConfig[];
}

export interface ExpressAppConfig {
    name: string;
    host: string;
    port: number;
    defaultHandler?: RouteHandler;
    middleware?: MiddlewareHandler[];
    routes: RouteConfig[];
}

export const sendResponse = (res: Response, response: HTTPResponse): void => {
    res.status(response.code).json(response);
};
