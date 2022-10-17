import {AuthChecker} from '@electrovir/database/src/graphql/type-graphql';
import {ApolloContext} from '../apollo-context';
import {assertValidRoles, isRoleAtLeast} from './auth-roles';

export function authChecker(
    ...[
        {context, info},
        roles,
    ]: Parameters<AuthChecker<ApolloContext>>
): ReturnType<AuthChecker<ApolloContext>> {
    assertValidRoles(roles);

    const passesAuthCheck = isRoleAtLeast({
        input: context.requestAuth,
        requirement: roles,
    });
    if (!passesAuthCheck) {
        console.error(
            `Failed auth check on "${info.fieldName}": Got "${context.requestAuth}" but required "${roles}"`,
        );
    }
    return passesAuthCheck;
}
