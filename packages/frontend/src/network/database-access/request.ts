import {Post, User} from '@electrovir/database/src/prisma/prisma-types';
import './subscription';

import {ApolloClient, gql, InMemoryCache} from '@apollo/client/core';

function getClient() {
    const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        cache: new InMemoryCache(),
    });

    return client;
}

function createQueryContext(role: string) {
    return {
        context: {
            headers: {
                // obviously this is super naive and should not be used in production
                // as the client is not to be trusted as to what it's authorization is!
                role,
            },
        },
    };
}

export async function fetchUsers(role: string): Promise<ReadonlyArray<User>> {
    const data = await getClient().query<{users: ReadonlyArray<User>}>({
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
        ...createQueryContext(role),
    });

    return data.data.users;
}

export async function fetchPosts(role: string): Promise<ReadonlyArray<Post>> {
    const data = await getClient().query<{posts: ReadonlyArray<Post>}>({
        query: gql`
            {
                posts {
                    id
                }
            }
        `,
        ...createQueryContext(role),
    });

    return data.data.posts;
}
