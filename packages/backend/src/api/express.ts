import cors, {CorsOptions} from 'cors';
import express from 'express';

const allowedOrigins = ['http://localhost'];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        console.log('request origin', origin);
        if (origin && allowedOrigins.find((allowed) => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

export function startExpressApp() {
    const app = express();
    app.use(cors(corsOptions));
    return app;
}
