import {clearDatabase} from '../../generic-database-client/generic-client-utilities/delete';
import {callWithDbClient, WithClientInterface} from '../prisma-client';
import {seedFromNothing} from './seed-from-nothing';

async function resetDatabase(clientInterface: WithClientInterface) {
    await clearDatabase(clientInterface.client);
    await seedFromNothing(clientInterface);
}

if (require.main === module) {
    callWithDbClient(resetDatabase);
}
