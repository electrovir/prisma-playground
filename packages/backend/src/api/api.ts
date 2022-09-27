import {callWithDatabaseClient, WithClientInterface} from '../database/prisma-client/prisma-client';
import {startApolloServer} from './apollo';
import {startExpressApp} from './express';

async function main(clientInterface: WithClientInterface) {
    const expressServer = startExpressApp();

    const apolloServer = await startApolloServer(clientInterface.client);
    apolloServer.applyMiddleware({app: expressServer});

    expressServer.listen(4000, () => {
        console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`);
    });
}

callWithDatabaseClient(main);
