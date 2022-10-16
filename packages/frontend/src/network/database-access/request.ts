import {User} from '@prisma/client';
import './subscription';

import {ApolloClient, gql, InMemoryCache} from '@apollo/client/core';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

export async function fetchUsers(): Promise<ReadonlyArray<User>> {
    const data = await client.query<{users: ReadonlyArray<User>}>({
        query: gql`
            {
                users {
                    id
                    posts {
                        id
                    }
                }
            }
        `,
    });

    return data.data.users;
}
