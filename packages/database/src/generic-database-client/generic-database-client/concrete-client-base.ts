import {Prisma, PrismaPromise, UnwrapTuple} from '@electrovir/database/src/prisma/prisma-types';

/** The base methods that exist on all prisma clients regardless of which models they contain. */
export type ConcreteClientBase = {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $use(cb: Prisma.Middleware): void;
    $executeRaw(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;
    $executeRawUnsafe(query: string, ...values: any[]): PrismaPromise<number>;
    $queryRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: any[]
    ): PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;
    $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;
};
