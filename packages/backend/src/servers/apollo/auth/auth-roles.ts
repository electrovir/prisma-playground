import {combineErrors, ensureError, isEnumValue, isTruthy} from 'augment-vir';

export enum AuthRole {
    King = 'king',
    Lord = 'lord',
    Peasant = 'peasant',
    Nothing = 'nothing',
}

const roleHierarchy: Readonly<Record<AuthRole, number>> = {
    [AuthRole.King]: 999,
    [AuthRole.Lord]: 500,
    [AuthRole.Peasant]: 100,
    [AuthRole.Nothing]: 0,
};

export function getHighestRole(roles: ReadonlyArray<AuthRole>) {
    return roles.reduce((highestRole, role) => {
        if (isRoleAtLeast({input: role, requirement: highestRole})) {
            return role;
        } else {
            return highestRole;
        }
    }, AuthRole.Nothing);
}

export function toValidAuthRole(input: unknown): AuthRole {
    if (isValidRole(input)) {
        return input;
    } else {
        return AuthRole.Nothing;
    }
}

export function isValidRole(input: unknown): input is AuthRole {
    return isEnumValue(input, AuthRole);
}

export function assertValidRole(input: unknown): asserts input is AuthRole {
    if (!isValidRole(input)) {
        throw new Error(`"${input}" is not a valid role`);
    }
}

export function assertValidRoles(
    inputs: ReadonlyArray<unknown>,
): asserts inputs is ReadonlyArray<AuthRole> {
    const errors = inputs
        .map((input) => {
            try {
                assertValidRole(input);
                return undefined;
            } catch (error) {
                return ensureError(error);
            }
        })
        .filter(isTruthy);

    if (errors.length) {
        throw combineErrors(errors);
    }
}

export function isRoleAtLeast({
    input: rawRoleToCheck,
    requirement: rawRoleRequirement,
}: {
    input: unknown;
    requirement: AuthRole | ReadonlyArray<AuthRole>;
}) {
    const roleToCheck: AuthRole = isEnumValue(rawRoleToCheck, AuthRole)
        ? rawRoleToCheck
        : AuthRole.Nothing;

    const roleRequirements: ReadonlyArray<AuthRole> = Array.isArray(rawRoleRequirement)
        ? rawRoleRequirement
        : [rawRoleRequirement];

    const checkHierarch = roleHierarchy[roleToCheck];

    return roleRequirements.every((roleRequirement) => {
        const requiredHierarch = roleHierarchy[roleRequirement];

        return checkHierarch >= requiredHierarch;
    });
}
