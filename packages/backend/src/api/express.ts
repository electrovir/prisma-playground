import cors, {CorsOptions} from 'cors';
import express, {Express} from 'express';

function setupCors(expressApp: Express) {
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

    expressApp.use(cors(corsOptions));
}

function setupLogger(expressApp: Express) {
    expressApp.use((req, res, next) => {
        console.info(
            `${req.method}: ${req.protocol}://${req.header('Host')}${
                req.originalUrl
            } from ${req.get('Origin')}`,
        );
        next();
    });
}

export function startExpressApp() {
    const app = express();
    setupCors(app);
    setupLogger(app);
    return app;
}
