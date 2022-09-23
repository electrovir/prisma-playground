import {PrismaClient} from '@prisma/client';
import {addExitCallback} from 'catch-exit';

const myPrismaClient = new PrismaClient();

export type PlaygroundDbClient = typeof myPrismaClient;

export async function callWithDbClient(
    callback: (client: PlaygroundDbClient) => void | Promise<void>,
) {
    try {
        await callback(myPrismaClient);
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
