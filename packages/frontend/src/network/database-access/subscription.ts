import {createClient as createWebSocketClient} from 'graphql-ws';

const client = createWebSocketClient({
    url: 'ws://localhost:4000/graphql',
});

export function subscribeToMessages(role: string, callback: (data: string) => void): void {
    client.subscribe<{normalSubscription: string}>(
        {
            query: `subscription {
                normalSubscription
              }`,
            variables: {
                role,
            },
        },
        {
            next: (data) => {
                console.log(data);
                callback(data.data!.normalSubscription);
            },
            error: (error) => {
                console.error(error);
            },
            complete: () => {
                console.info('subscription complete?');
            },
        },
    );
}
