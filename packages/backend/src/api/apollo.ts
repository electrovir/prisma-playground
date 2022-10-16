import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';
import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {ApolloServer, gql} from 'apollo-server-express';
import {PubSub} from 'graphql-subscriptions';

const typeDefs = gql`
    type Query {
        messages: [Message!]!
    }

    type Subscription {
        messageCreated: Message
    }

    type Message {
        id: String
        content: String
    }
`;

const pubsub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';

const extraResolvers = {
    Query: {
        messages: () => [
            {id: 0, content: 'Hello!'},
            {id: 1, content: 'Bye!'},
        ],
    },
    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
        },
    },
};

export async function startApolloServer(prisma: ConcreteClientBase) {
    const schema = await buildPlaygroundSchema();

    const apolloServer = new ApolloServer({
        context: () => ({prisma}),
        schema,
        resolvers: extraResolvers,
        typeDefs,
    });

    await apolloServer.start();

    return apolloServer;
}

setInterval(() => {
    pubsub.publish(MESSAGE_CREATED, {
        postCreated: {
            author: 'Ali Baba',
            comment: 'Open sesame',
        },
    });
}, 1000);
