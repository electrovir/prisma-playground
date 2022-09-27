import {ApolloServer} from 'apollo-server-express';
import {makeSchema, nullable, objectType, queryType, stringArg} from 'nexus';
import {dirname, join} from 'path';
import {callWithDatabaseClient} from '../database/prisma-client/prisma-client';
import {ConcreteClientBase} from '../shared/database/generic-database-client/concrete-client-base';

export async function startApolloServer(prisma: ConcreteClientBase) {
    const apollo = new ApolloServer({
        context: () => ({prisma}),
        // I hate this but it'll do for now
        schema: makeSchema({
            sourceTypes: {
                modules: [
                    {
                        module: '.prisma/client',
                        alias: 'PrismaClient',
                    },
                ],
            },
            outputs: {
                typegen: join(dirname(__filename), 'node_modules/@types/nexus-typegen/index.d.ts'),
                schema: join(dirname(__filename), './api.graphql'),
            },
            shouldExitAfterGenerateArtifacts: false,
            types: [
                objectType({
                    name: 'User',
                    definition(define) {
                        define.id('id');
                        define.string('name', {
                            resolve(parent) {
                                return parent.name;
                            },
                        });
                    },
                }),
                queryType({
                    definition(define) {
                        define.list.field('users', {
                            type: 'User',
                            args: {
                                world: nullable(stringArg()),
                            },
                            resolve: async () => {
                                return await callWithDatabaseClient(async (clientInterface) => {
                                    try {
                                        const result = await clientInterface.client.user.findMany();
                                        return result;
                                    } catch (error) {
                                        console.error(error);
                                        throw error;
                                    }
                                });
                            },
                        });
                    },
                }),
            ],
        }),
    });

    await apollo.start();

    return apollo;
}
