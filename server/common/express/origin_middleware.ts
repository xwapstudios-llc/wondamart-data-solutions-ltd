import cors, {CorsOptions} from "cors";
import {MiddlewareHandler} from "./index";

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'https://wondamartgh.com',
    'https://pay.wondamartgh.com',
    'https://api.wondamartgh.com',
    'https://server.wondamartgh.com',
];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
};

const origen_middleware: MiddlewareHandler = cors(corsOptions);
export {
    origen_middleware
}
