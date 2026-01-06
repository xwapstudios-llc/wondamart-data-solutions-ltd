import { Request, Response, NextFunction } from "express";
import { HTTPResponse } from "@common/types/request";

export interface MiddlewareHandler {
    (req: Request, res: Response, next: NextFunction): Promise<void> | void | any;
}

export interface RouteHandler {
    (req: Request, res: Response, next?: NextFunction): Promise<void> | void;
}

export interface RouteConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    handler: RouteHandler;
    middleware?: MiddlewareHandler[];
}

export interface ExpressAppConfig {
    port: number;
    host: string;
    name: string;
    middleware?: MiddlewareHandler[];
    routes: RouteConfig[];
}

export const sendResponse = (res: Response, response: HTTPResponse): void => {
    res.status(response.code).json(response);
};
