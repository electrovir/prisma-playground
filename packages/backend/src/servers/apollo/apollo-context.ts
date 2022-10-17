import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';
import {AuthRole} from './auth/auth-roles';

export type ApolloContext = {
    prisma: ConcreteClientBase;
    requestAuth: AuthRole;
};
