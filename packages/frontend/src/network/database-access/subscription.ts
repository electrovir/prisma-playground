import {createClient as createWebSocketClient} from 'graphql-ws';

const client = createWebSocketClient({
    url: 'ws://localhost:4000/graphql',
});

async function getCurrentNumber(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        let combinedData: string = '';
        client.subscribe(
            {
                query: `
                    {
                        currentNumber
                    }
                `,
            },
            {
                next: (data) => {
                    combinedData += data.data!.currentNumber;
                },
                error: (error) => {
                    reject(error);
                },
                complete: () => {
                    resolve(Number(combinedData));
                },
            },
        );
    });
}

export async function subscribeToCurrentNumber(callback: (data: number) => void) {
    const currentNumber = await getCurrentNumber();
    client.subscribe(
        {
            query: `
                    subscription {
                        numberIncremented
                    }
                `,
        },
        {
            next: (data) => {
                callback(data.data!.numberIncremented as any);
            },
            error: (error) => {
                console.error({error});
            },
            complete: () => {
                console.info('subscription complete?');
            },
        },
    );

    return currentNumber;
}
