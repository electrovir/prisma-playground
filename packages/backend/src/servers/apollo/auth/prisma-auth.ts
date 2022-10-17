import {Authorized, ResolversEnhanceMap} from '@electrovir/database/src/graphql/type-graphql';
import {AuthRole} from './auth-roles';

export const prismaOnlyResolverAuth: ResolversEnhanceMap = {
    Post: {
        _all: [Authorized(AuthRole.Lord)],
    },
    User: {
        _all: [Authorized(AuthRole.King)],
    },
};
