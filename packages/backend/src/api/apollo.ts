import {ConcreteClientBase} from '@electrovir/database/src/generic-database-client/generic-database-client/concrete-client-base';
import {buildPlaygroundSchema} from '@electrovir/database/src/graphql/build-schema';
import {ApolloServer} from 'apollo-server-express';

export async function startApolloServer(prisma: ConcreteClientBase) {
    const schema = await buildPlaygroundSchema();

    const apollo = new ApolloServer({
        context: () => ({prisma}),
        schema,
    });

    await apollo.start();

    return apollo;
}
