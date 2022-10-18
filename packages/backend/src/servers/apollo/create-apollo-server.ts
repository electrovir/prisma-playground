import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import {ApolloServer} from 'apollo-server-express';
import {randomString} from 'augment-vir/dist/cjs/node-only';
import {PubSub} from 'graphql-subscriptions';
import {useServer} from 'graphql-ws/lib/use/ws';
import {Server} from 'http';
import {WebSocketServer} from 'ws';
import {createLogger} from '../logging/create-server-logger';
import {extractAuthRoleForSubscription, extractAuthRoleFromRequest} from './auth/extract-auth-role';
import {createGraphQlSchema} from './create-graphql-schema';
import {RequestContext} from './request-context';
import {SampleResolver} from './subscription-resolver';

export async function startApolloServer({
    httpServer,
    prisma,
}: {
    httpServer: Server;
    prisma: ConcreteClientBase;
}) {
    const pubSub = new PubSub();
    const schema = await createGraphQlSchema([SampleResolver], pubSub);

    async function sendMessages() {
        await pubSub.publish('NOTIFICATIONS', randomString());
        setTimeout(() => {
            sendMessages();
        }, 1000);
    }

    // Start incrementing
    sendMessages();

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

    const subscriptionServerCleanup = useServer(
        {
            schema,
            context: (graphQlWsContext, message): RequestContext => {
                return {
                    prisma,
                    requestAuth: extractAuthRoleForSubscription(message.payload),
                };
            },
        },
        webSocketServer as any,
    );

    const apolloServer = new ApolloServer({
        context: (expressContext): RequestContext => {
            return {
                prisma,
                requestAuth: extractAuthRoleFromRequest(expressContext.req),
            };
        },
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
