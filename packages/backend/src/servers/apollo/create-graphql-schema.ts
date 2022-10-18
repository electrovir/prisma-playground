import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {PubSubEngine} from '@electrovir/database/src/graphql/type-graphql';
import {authChecker} from './auth/auth-check';

export async function createGraphQlSchema(
    customResolvers: ReadonlyArray<Function>,
    pubSub: PubSubEngine,
) {
    const schemaForPrismaCrud = await buildPlaygroundSchema(customResolvers, authChecker, pubSub);

    return schemaForPrismaCrud;
}
