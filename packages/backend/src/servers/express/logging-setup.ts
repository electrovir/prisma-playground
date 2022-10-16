import {NextFunction, Request, Response} from 'express';
import {createLogger} from '../logging/create-server-logger';

export function createLoggingMiddleware() {
    const expressLogger = createLogger();
    return (request: Request, response: Response, next: NextFunction) => {
        expressLogger({
            host: request.header('Host') ?? '',
            method: request.method,
            origin: request.header('Origin') ?? '',
            path: request.originalUrl,
            protocol: request.protocol,
        });
        next();
    };
}
