import express, { Express } from "express";
import { ExpressAppConfig, RouteConfig } from "./types";

export const createExpressApp = (config: ExpressAppConfig): Express => {
    const app = express();
    
    // Default middleware
    app.use(express.json());
    
    // Global middleware
    if (config.middleware) {
        config.middleware.forEach(middleware => {
            app.use(middleware);
        });
    }
    
    // Routes
    config.routes.forEach((route: RouteConfig) => {
        const middlewares = route.middleware || [];
        
        switch (route.method) {
            case 'GET':
                app.get(route.path, ...middlewares, route.handler);
                break;
            case 'POST':
                app.post(route.path, ...middlewares, route.handler);
                break;
            case 'PUT':
                app.put(route.path, ...middlewares, route.handler);
                break;
            case 'DELETE':
                app.delete(route.path, ...middlewares, route.handler);
                break;
            case 'PATCH':
                app.patch(route.path, ...middlewares, route.handler);
                break;
        }
    });
    
    return app;
};

export const startServer = (app: Express, config: ExpressAppConfig): void => {
    app.listen(config.port, () => {
        console.log(`${config.name} running at http://${config.host}:${config.port}`);
    });
};

export const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req: any, res: any) => {
    res.status(404).json({ error: "Not found" });
};