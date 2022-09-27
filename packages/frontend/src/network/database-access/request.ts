import {User} from '@prisma/client';
import {gql} from '../../data/graphql';
import {ensureError} from '../../ui/promise-resolver';

const stuff = gql`
    {
        users {
            id
        }
    }
`;

async function makeQuery(query: string) {
    const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query}),
    });

    if (response.ok) {
        try {
            return await response.json();
        } catch (jsonParseError) {
            throw ensureError(jsonParseError);
        }
    } else {
        throw new Error(`${response.status}: ${response.statusText}`);
    }
}

export async function fetchUsers(): Promise<User[]> {
    const result = await makeQuery(stuff);
    return result.data.users;
}
