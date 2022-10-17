import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {mergeSchemas} from '@graphql-tools/schema';
import {IResolvers} from '@graphql-tools/utils';
import {createCustomSubscriptionSchema} from './graphql-subscriptions';

export async function createGraphQlSchema(resolvers: IResolvers | Array<IResolvers>) {
    const schemaForPrismaCrud = await buildPlaygroundSchema();
    const schemaForSubscriptions = createCustomSubscriptionSchema(resolvers);

    const mergedSchema = mergeSchemas({
        schemas: [
            schemaForSubscriptions,
            schemaForPrismaCrud,
        ],
    });

    return mergedSchema;
}
