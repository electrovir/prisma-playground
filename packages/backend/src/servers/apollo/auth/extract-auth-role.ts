import {Request} from 'express';
import {AuthRole, toValidAuthRole} from './auth-roles';

export function extractAuthRoleFromRequest(expressRequest: Request): AuthRole {
    const fromHeader = expressRequest.headers['role'];
    return toValidAuthRole(fromHeader);
}

export function extractAuthRoleForSubscription(payload: {
    variables?: Record<string, unknown> | null;
}): AuthRole {
    const fromVars = payload.variables?.role;
    return toValidAuthRole(fromVars);
}
