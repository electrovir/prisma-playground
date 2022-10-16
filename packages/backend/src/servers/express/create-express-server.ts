import express from 'express';
import {createCorsMiddleware} from './express-cors-setup';
import {createLoggingMiddleware} from './logging-setup';

export function startExpressServer() {
    const expressServer = express();
    expressServer.use(createCorsMiddleware());
    expressServer.use(createLoggingMiddleware());
    return expressServer;
}
