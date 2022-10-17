import {makeExecutableSchema} from '@graphql-tools/schema';
import {IResolvers} from '@graphql-tools/utils';
import {gql} from 'apollo-server-express';

export function createCustomSubscriptionSchema(resolvers: IResolvers | Array<IResolvers>) {
    // Schema definition
    const typeDefs = gql`
        type Query {
            currentNumber: Int
        }

        type Subscription {
            numberIncremented: Int
        }
    `;

    const schema = makeExecutableSchema({typeDefs, resolvers});

    return schema;
}
