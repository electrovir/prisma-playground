import {
    applyResolversEnhanceMap,
    AuthChecker,
    Authorized,
    ResolversEnhanceMap,
} from '@electrovir/database/src/graphql/type-graphql';
import {isEnumValue} from 'augment-vir';
import {ApolloContext} from './apollo-context';

export enum Role {
    King = 'king',
    Lord = 'lord',
    Peasant = 'peasant',
    Nothing = 'nothing',
}

const roleHierarchy: Readonly<Record<Role, number>> = {
    [Role.King]: 999,
    [Role.Lord]: 500,
    [Role.Peasant]: 100,
    [Role.Nothing]: 0,
};

const resolversEnhanceMap: ResolversEnhanceMap = {
    Post: {
        _all: [Authorized(Role.Lord)],
    },
    User: {
        _all: [Authorized(Role.King)],
    },
};

function isRoleAtLeast(rawRoleToCheck: unknown, rawRoleRequirements: Role | ReadonlyArray<Role>) {
    const roleToCheck: Role = isEnumValue(rawRoleToCheck, Role) ? rawRoleToCheck : Role.Nothing;

    const roleRequirements: ReadonlyArray<Role> = Array.isArray(rawRoleRequirements)
        ? rawRoleRequirements
        : [rawRoleRequirements];

    const checkHierarch = roleHierarchy[roleToCheck];

    return roleRequirements.every((roleRequirement) => {
        const requiredHierarch = roleHierarchy[roleRequirement];

        return checkHierarch >= requiredHierarch;
    });
}

applyResolversEnhanceMap(resolversEnhanceMap);

export function authChecker(
    ...[
        {root, args, context, info},
        roles,
    ]: Parameters<AuthChecker<ApolloContext>>
): ReturnType<AuthChecker<ApolloContext>> {
    console.log(`auth for "${info.fieldName}" (needs ${roles})`);
    return info.fieldName !== 'posts';
}
