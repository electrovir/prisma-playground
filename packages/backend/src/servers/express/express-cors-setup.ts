import cors, {CorsOptions} from 'cors';

export function createCorsMiddleware() {
    const allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
    ];

    const corsOptions: CorsOptions = {
        origin: (origin, callback) => {
            if (
                origin == null ||
                origin === 'null' ||
                (origin && allowedOrigins.find((allowed) => origin.startsWith(allowed)))
            ) {
                callback(null, true);
            } else {
                console.error(`origin blocked: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
    };

    return cors(corsOptions);
}
