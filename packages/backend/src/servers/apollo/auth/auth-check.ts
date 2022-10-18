import {applyResolversEnhanceMap, AuthChecker} from '@electrovir/database/src/graphql/type-graphql';
import {RequestContext} from '../request-context';
import {assertValidRoles, isRoleAtLeast} from './auth-roles';
import {prismaOnlyResolverAuth} from './prisma-auth';

// this MUST happen before buildPlaygroundSchema
applyResolversEnhanceMap(prismaOnlyResolverAuth);

export function authChecker(
    ...[
        {root, args, info, context},
        roles,
    ]: Parameters<AuthChecker<RequestContext>>
): ReturnType<AuthChecker<RequestContext>> {
    try {
        assertValidRoles(roles);

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
    } catch (error) {
        console.error(error);
        return false;
    }
}
