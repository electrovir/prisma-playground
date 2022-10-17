import {
    callWithDatabaseClient,
    WithClientInterface,
} from '@electrovir/database/src/prisma/prisma-client';
import {createServer} from 'http';
import {startApolloServer} from '../servers/apollo/create-apollo-server';
import {startExpressServer} from '../servers/express/create-express-server';

async function main(clientInterface: WithClientInterface) {
    const PORT = 4000;

    const expressServer = startExpressServer();
    const httpServer = createServer(expressServer);

    // Set up ApolloServer.
    const apolloServer = await startApolloServer({
        httpServer,
        prisma: clientInterface.client,
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
