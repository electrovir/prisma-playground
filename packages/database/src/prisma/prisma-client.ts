import {addExitCallback} from 'catch-exit';
import {join} from 'path';
import {databaseDir} from '../file-paths';
import {
    ClientModelNamesEnum,
    makeModelNameEnum,
} from '../generic-database-client/generic-database-client/generic-model';
import {PrismaClient} from '../prisma/prisma-types';
// import {initPrismaDatabase} from './init-prisma-database';

const devDatabasePath = join(databaseDir, 'prisma/database/dev.sqlite');

const myPrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: `file:${devDatabasePath}`,
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

// async function initDatabaseIfMissing() {
//     if (!existsSync(devDatabasePath)) {
//         await initPrismaDatabase(devDatabasePath);
//     }
// }

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
