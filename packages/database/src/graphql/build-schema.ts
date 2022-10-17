import {AuthChecker, buildSchema, resolvers} from './type-graphql';

export async function buildPlaygroundSchema(
    customResolvers: ReadonlyArray<Function>,
    authChecker: AuthChecker<any>,
) {
    return await buildSchema({
        resolvers: [
            ...resolvers,
            ...customResolvers,
        ],
        validate: true,
        authChecker,
        authMode: 'null',
    });
}
