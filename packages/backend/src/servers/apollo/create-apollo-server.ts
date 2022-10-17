import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';
import {IResolvers} from '@graphql-tools/utils';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import {ApolloServer} from 'apollo-server-express';
import {useServer} from 'graphql-ws/lib/use/ws';
import {Server} from 'http';
import {WebSocketServer} from 'ws';
import {createLogger} from '../logging/create-server-logger';
import {createGraphQlSchema} from './create-graphql-schema';

export async function startApolloServer({
    httpServer,
    resolvers,
    prisma,
}: {
    httpServer: Server;
    resolvers: IResolvers | Array<IResolvers>;
    prisma: ConcreteClientBase;
}) {
    const schema = await createGraphQlSchema(resolvers);

    // Set up WebSocket server.
    const webSocketServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    const webSocketLogger = createLogger();

    webSocketServer.on('connection', (webSocket, request) => {
        webSocketLogger({
            host: request.headers.host ?? '',
            method: request.method ?? '',
            origin: request.headers.origin ?? '',
            path: request.url ?? '',
            protocol: 'ws',
        });
    });

    const subscriptionServerCleanup = useServer({schema}, webSocketServer);

    const apolloServer = new ApolloServer({
        context: () => ({prisma}),
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({httpServer}),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await subscriptionServerCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await apolloServer.start();

    return apolloServer;
}
