import {makeExecutableSchema} from '@graphql-tools/schema';
import {gql} from 'apollo-server-express';
import {PubSub} from 'graphql-subscriptions';

export function createCustomSubscriptionSchema(pubSub: PubSub) {
    // Schema definition
    const typeDefs = gql`
        type Query {
            currentNumber: Int
        }

        type Subscription {
            numberIncremented: Int
        }
    `;

    let currentNumber = 0;

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
    const schema = makeExecutableSchema({typeDefs, resolvers});

    return schema;
}
