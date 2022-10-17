import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {
    applyResolversEnhanceMap,
    PubSubEngine,
} from '@electrovir/database/src/graphql/type-graphql';
import {authChecker} from './auth/auth-check';
import {prismaOnlyResolverAuth} from './auth/prisma-auth';

export async function createGraphQlSchema(
    customResolvers: ReadonlyArray<Function>,
    pubSub: PubSubEngine,
) {
    const schemaForPrismaCrud = await buildPlaygroundSchema(customResolvers, authChecker, pubSub);

    applyResolversEnhanceMap(prismaOnlyResolverAuth);

    return schemaForPrismaCrud;
}
