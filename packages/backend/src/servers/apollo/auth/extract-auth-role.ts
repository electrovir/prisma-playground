import {Request} from 'express';
import {AuthRole, toValidAuthRole} from './auth-roles';

export function extractAuthRole(expressRequest: Request): AuthRole {
    const fromHeader = expressRequest.header('role');

    return toValidAuthRole(fromHeader);
}
