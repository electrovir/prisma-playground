import {createClient} from 'graphql-ws';

const client = createClient({
    url: 'ws://localhost:4000/graphql',
});

console.log('subscribing');

// just a query?
client.subscribe(
    {
        query: '{ currentNumber }',
    },
    {
        next: (data) => {
            console.log({queryData: data});
        },
        error: (error) => {
            console.error({error});
        },
        complete: () => {
            console.log('query complete');
        },
    },
);

client.subscribe(
    {
        query: 'subscription { numberIncremented }',
    },
    {
        next: (data) => {
            console.log({data});
        },
        error: (error) => {
            console.error({error});
        },
        complete: () => {
            console.log('subscription complete');
        },
    },
);
