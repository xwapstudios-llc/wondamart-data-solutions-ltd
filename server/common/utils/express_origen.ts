import cors, {CorsOptions} from "cors";

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'https://wondamartgh.com',
    'https://pay.wondamartgh.com'
];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // If the request has no origin (like Postman or mobile apps), allow it
        // or check if the origin is in our whitelist
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Set to true if you need to send cookies or sessions
};

const corsOriginMiddleware = cors(corsOptions);
export {
    corsOriginMiddleware
}