import {
    applyResolversEnhanceMap,
    AuthChecker,
    Authorized,
    ResolversEnhanceMap,
} from '@electrovir/database/src/graphql/type-graphql';
import {ApolloContext} from './apollo-context';

export enum Role {
    Peasant = 'peasant',
    Lord = 'lord',
    King = 'king',
}

const resolversEnhanceMap: ResolversEnhanceMap = {
    Post: {
        _all: [Authorized(Role.Lord)],
    },
    User: {
        _all: [Authorized(Role.King)],
    },
};

applyResolversEnhanceMap(resolversEnhanceMap);

export function authChecker(
    ...[
        {root, args, context, info},
        roles,
    ]: Parameters<AuthChecker<ApolloContext>>
): ReturnType<AuthChecker<ApolloContext>> {
    console.log(`auth for "${info.fieldName}"`);
    return info.fieldName !== 'posts';
}
