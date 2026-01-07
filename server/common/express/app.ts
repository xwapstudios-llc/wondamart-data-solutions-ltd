import express, {Express, NextFunction, Request, Response} from "express";
import {ExpressAppConfig, MiddlewareHandler, RouteConfig, RouteHandler} from "./types";


function generateOpenApi(
    routes: RouteConfig[],
    basePath = "",
    paths: any = {}
) {
    for (const route of routes) {
        const fullPath = `${basePath}${route.path}`.replace(/\/+/g, "/");

        const methods = ["get", "post", "put", "patch", "delete"] as const;

        for (const method of methods) {
            const config = route[method];
            if (!config) continue;

            const methodConfig =
                typeof config === "function"
                    ? { handler: config }
                    : config;

            paths[fullPath] ??= {};
            paths[fullPath][method] = {
                summary: methodConfig.openapi?.summary,
                description: methodConfig.openapi?.description,
                tags: methodConfig.openapi?.tags,
                operationId: methodConfig.openapi?.operationId,
                requestBody: methodConfig.openapi?.requestBody,
                responses:
                    methodConfig.openapi?.responses ??
                    { "200": { description: "Success" } },
            };
        }

        if (route.children) {
            generateOpenApi(route.children, fullPath, paths);
        }
    }

    return paths;
}

export function buildOpenApiSpec(routes: RouteConfig[]) {
    return {
        openapi: "3.0.3",
        info: {
            title: "Wondamart-gh API",
            version: "1.0.0",
        },
        paths: generateOpenApi(routes),
    };
}

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

    // Default global handler
    config.defaultHandler ? app.use(asyncHandler(config.defaultHandler)) : app.use(notFoundHandler);

    const setupRoutes = (
        routes: RouteConfig[],
        basePath = "",
        parentMiddleware: MiddlewareHandler[] = []
    ) => {
        routes.forEach(route => {
            const fullPath = `${basePath}${route.path}`.replace(/\/+/g, "/");
            const middleware = [...parentMiddleware, ...(route.middleware || [])];

            const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

            methods.forEach(method => {
                const routeHandler = route[method];
                if (!routeHandler) return;

                const handler =
                    typeof routeHandler === "function"
                        ? routeHandler
                        : routeHandler.handler;

                const handlerMiddleware =
                    typeof routeHandler === "object" && routeHandler.middleware
                        ? [...middleware, ...routeHandler.middleware]
                        : middleware;

                console.log(`method: ${method} path: `, fullPath);
                app[method](fullPath, ...handlerMiddleware, asyncHandler(handler));
            });

            if (route.children) {
                setupRoutes(route.children, fullPath, middleware);
            }
        });
    };

    setupRoutes(config.routes);

    return app;
};

export const startServer = (app: Express, config: ExpressAppConfig): void => {
    app.listen(config.port, () => {
        console.log(`${config.name} running at http://${config.host}:${config.port}`);
    });
};

export const asyncHandler = (fn: RouteHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({error: "Not found"});
};