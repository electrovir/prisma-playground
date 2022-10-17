import {
    callWithDatabaseClient,
    WithClientInterface,
} from '@electrovir/database/src/prisma/prisma-client';
import {PubSub} from 'graphql-subscriptions';
import {createServer} from 'http';
import {startApolloServer} from '../servers/apollo/create-apollo-server';
import {startExpressServer} from '../servers/express/create-express-server';
import {SampleResolver} from './subscription-resolver';

async function main(clientInterface: WithClientInterface) {
    const PORT = 4000;
    const pubSub = new PubSub();

    const expressServer = startExpressServer();
    const httpServer = createServer(expressServer);

    // In the background, increment a number every second and notify subscribers when it changes.
    let currentNumber = 0;
    async function incrementNumber() {
        // console.log('incrementing');
        currentNumber++;
        await pubSub.publish('NUMBER_INCREMENTED', {numberIncremented: currentNumber});
        await pubSub.publish('NOTIFICATIONS', 'yolo');
        setTimeout(() => {
            incrementNumber();
        }, 1000);
    }

    // Start incrementing
    incrementNumber();
    // Resolver map
    const resolvers = {
        Query: {
            currentNumber() {
                return currentNumber;
            },
        },
        Subscription: {
            numberIncremented: {
                subscribe: () => pubSub.asyncIterator(['NUMBER_INCREMENTED']),
            },
        },
    };

    // Set up ApolloServer.
    const apolloServer = await startApolloServer({
        httpServer,
        prisma: clientInterface.client,
        resolvers: [SampleResolver],
        pubSub,
    });

    apolloServer.applyMiddleware({
        app: expressServer,
        path: '/graphql',
    });

    // Now that our HTTP server is fully set up, actually listen.
    httpServer.listen(PORT, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
    });
}

callWithDatabaseClient(main);
