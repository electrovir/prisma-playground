import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';

export type ApolloContext = {
    prisma: ConcreteClientBase;
};
