export function createLogger() {
    return ({
        protocol,
        path,
        method,
        origin,
        host,
    }: {
        protocol: string;
        path: string;
        method: string;
        origin: string;
        host: string;
    }) => {
        console.info(`${method}: ${protocol}://${host}${path} from ${origin}`);
    };
}
