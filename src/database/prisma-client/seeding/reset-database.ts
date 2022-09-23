import {clearDatabase} from '../../generic-database-client/generic-client-utilities/delete';
import {callWithDbClient, PlaygroundDbClient} from '../prisma-client';
import {seedFromNothing} from './seed-from-nothing';

async function resetDatabase(client: PlaygroundDbClient) {
    await clearDatabase(client);
    await seedFromNothing(client);
}

if (require.main === module) {
    callWithDbClient(resetDatabase);
}
