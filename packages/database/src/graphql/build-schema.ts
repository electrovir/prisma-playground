import {AuthChecker, buildSchema, PubSubEngine, resolvers} from './type-graphql';

export async function buildPlaygroundSchema(
    customResolvers: ReadonlyArray<Function>,
    authChecker: AuthChecker<any>,
    pubSub: PubSubEngine,
) {
    return await buildSchema({
        resolvers: [
            ...resolvers,
            ...customResolvers,
        ],
        validate: true,
        pubSub,
        authChecker,
        authMode: 'null',
    });
}
