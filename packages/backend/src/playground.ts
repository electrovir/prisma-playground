import {
    callWithDatabaseClient,
    PlaygroundClient,
} from '@electrovir/database/src/prisma/prisma-client';

type PlaygroundQuery = (client: PlaygroundClient) => Promise<any>;

const playgroundQueries: PlaygroundQuery[] = [
    async (client) => {
        return client.post.groupBy({
            by: [
                'content',
                'published',
            ],
        });
    },
    // async (client) => {
    //     return client.user.findMany()
    // },
];

async function runLatestQuery() {
    await callWithDatabaseClient(async (clientInterface) => {
        const result = await playgroundQueries[playgroundQueries.length - 1]!(
            clientInterface.client,
        );
        console.info(result);
    });
}

if (require.main === module) {
    runLatestQuery();
}
