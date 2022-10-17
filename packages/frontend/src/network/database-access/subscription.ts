import {createClient as createWebSocketClient} from 'graphql-ws';

const client = createWebSocketClient({
    url: 'ws://localhost:4000/graphql',
});

export function subscribeToMessages(callback: (data: string) => void, recursionDepth = 0): void {
    client.subscribe<{normalSubscription: string}>(
        {
            query: `subscription {
                normalSubscription
              }`,
        },
        {
            next: (data) => {
                console.log(data);
                callback(data.data!.normalSubscription);
            },
            error: (error) => {
                console.error(error);
                // try again
                if (recursionDepth <= 100) {
                    setTimeout(() => {
                        subscribeToMessages(callback, recursionDepth++);
                    }, 1000);
                }
            },
            complete: () => {
                console.info('subscription complete?');
            },
        },
    );
}
