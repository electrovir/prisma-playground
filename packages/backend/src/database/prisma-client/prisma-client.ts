import {PrismaClient} from '@prisma/client';
import {addExitCallback} from 'catch-exit';
import {join} from 'path';
import {repoDir} from '../../file-paths';
import {
    ClientModelNamesEnum,
    makeModelNameEnum,
} from '../../shared/database/generic-database-client/generic-model';

const devDbPath = join(repoDir, 'prisma/database/dev.sqlite');

const myPrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: `file:${devDbPath}`,
        },
    },
});

export type PlaygroundClient = typeof myPrismaClient;

export type WithClientInterface = Readonly<{
    client: PlaygroundClient;
    modelNames: ClientModelNamesEnum<PlaygroundClient>;
}>;

const clientInterface: WithClientInterface = {
    client: myPrismaClient,
    modelNames: makeModelNameEnum(myPrismaClient),
};

export async function callWithDatabaseClient<T>(
    callback: (client: WithClientInterface) => T | Promise<T>,
) {
    return await callback(clientInterface);
}

addExitCallback((signal) => {
    // can only perform async tasks on non 'exit' exits
    if (signal !== 'exit') {
        myPrismaClient.$disconnect();
    }
});
