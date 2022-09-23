import {PrismaClient} from '@prisma/client';
import {addExitCallback} from 'catch-exit';
import {
    ClientModelNamesEnum,
    makeModelNameEnum,
} from '../generic-database-client/generic-client/generic-model';

const myPrismaClient = new PrismaClient();

export type PlaygroundClient = typeof myPrismaClient;

export type WithClientInterface = {
    client: PlaygroundClient;
    modelNames: ClientModelNamesEnum<PlaygroundClient>;
};

export async function callWithDbClient(
    callback: (client: WithClientInterface) => void | Promise<void>,
) {
    try {
        const clientInterface: WithClientInterface = {
            client: myPrismaClient,
            modelNames: makeModelNameEnum(myPrismaClient),
        };

        await callback(clientInterface);
    } finally {
        await myPrismaClient.$disconnect();
    }
}

addExitCallback((signal) => {
    // can only perform async tasks on non 'exit' exits
    if (signal !== 'exit') {
        myPrismaClient.$disconnect();
    }
});
