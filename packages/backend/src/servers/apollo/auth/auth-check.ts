import {applyResolversEnhanceMap, AuthChecker} from '@electrovir/database/src/graphql/type-graphql';
import {ApolloContext} from '../apollo-context';
import {assertValidRoles, isRoleAtLeast} from './auth-roles';
import {prismaOnlyResolverAuth} from './prisma-auth';

// this MUST happen before buildPlaygroundSchema
applyResolversEnhanceMap(prismaOnlyResolverAuth);

export function authChecker(
    ...[
        {root, args, info, context},
        roles,
    ]: Parameters<AuthChecker<ApolloContext>>
): ReturnType<AuthChecker<ApolloContext>> {
    assertValidRoles(roles);
    console.log({root, args, info, context: !!context});

    const passesAuthCheck = isRoleAtLeast({
        input: context?.requestAuth,
        requirement: roles,
    });
    if (passesAuthCheck) {
        console.info(
            `Pased auth check on "${info.fieldName}": Got "${context?.requestAuth}" and required "${roles}"`,
        );
    } else {
        console.error(
            `Failed auth check on "${info.fieldName}": Got "${context?.requestAuth}" but required "${roles}"`,
        );
    }
    return passesAuthCheck;
}
