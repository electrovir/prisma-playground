import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {mergeSchemas} from '@graphql-tools/schema';
import {PubSub} from 'graphql-subscriptions';
import {createCustomSubscriptionSchema} from './graphql-subscriptions';

export async function createGraphQlSchema(pubSub: PubSub) {
    const schemaForPrismaCrud = await buildPlaygroundSchema();
    const schemaForSubscriptions = createCustomSubscriptionSchema(pubSub);

    const mergedSchema = mergeSchemas({
        schemas: [
            schemaForSubscriptions,
            schemaForPrismaCrud,
        ],
    });

    return mergedSchema;
}
