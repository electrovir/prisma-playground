import {makeExecutableSchema} from '@graphql-tools/schema';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import {PubSub} from 'graphql-subscriptions';
import {useServer} from 'graphql-ws/lib/use/ws';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';

async function main() {
    const PORT = 4000;
    const pubsub = new PubSub();

    // Schema definition
    const typeDefs = `#graphql
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

    // Resolver map
    const resolvers = {
        Query: {
            currentNumber() {
                return currentNumber;
            },
        },
        Subscription: {
            numberIncremented: {
                subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
            },
        },
    };

    // Create schema, which will be used separately by ApolloServer and
    // the WebSocket server.
    const schema = makeExecutableSchema({typeDefs, resolvers});

    // Create an Express app and HTTP server; we will attach the WebSocket
    // server and the ApolloServer to this HTTP server.
    const expressServer = express();
    const httpServer = createServer(expressServer);

    // Set up WebSocket server.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    const serverCleanup = useServer({schema}, wsServer);

    // Set up ApolloServer.
    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({httpServer}),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app: expressServer,
        path: '/graphql',
    });

    // expressServer.use(
    //     '/graphql',
    //     cors<cors.CorsRequest>(),
    //     bodyParser.json(),
    //     expressMiddleware(apolloServer),
    // );

    // Now that our HTTP server is fully set up, actually listen.
    httpServer.listen(PORT, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
    });

    // In the background, increment a number every second and notify subscribers when it changes.
    let currentNumber = 0;
    function incrementNumber() {
        // console.log('incrementing');
        currentNumber++;
        pubsub.publish('NUMBER_INCREMENTED', {numberIncremented: currentNumber});
        setTimeout(() => {
            incrementNumber();
        }, 1000);
    }

    expressServer.use((req, res, next) => {
        console.info(
            `${req.method}: ${req.protocol}://${req.header('Host')}${
                req.originalUrl
            } from ${req.get('Origin')}`,
        );
        next();
    });

    // Start incrementing
    incrementNumber();
}

main();
