import {extractErrorMessage, Writeable} from 'augment-vir';
import {randomBoolean, randomInteger, uuid} from '../../../augments/random';
import {
    createMany,
    CreateModelEntryData,
} from '../../generic-database-client/generic-client-utilities/create';
import {assertAllModelsAreEmpty} from '../../generic-database-client/generic-client-utilities/delete';
import {callWithDbClient, PlaygroundClient, WithClientInterface} from '../prisma-client';

export async function seedFromNothing({client, modelNames}: WithClientInterface) {
    try {
        await assertAllModelsAreEmpty(client);
    } catch (error) {
        throw new Error(`Cannot seed database with existing data: ${extractErrorMessage(error)}`);
    }

    const randomUserData = generateRandomUserData(randomInteger({min: 20, max: 50}));

    await createMany(client, modelNames.user, randomUserData);
}

function generateRandomUserData(
    randomUserCount: number,
): ReadonlyArray<
    CreateModelEntryData<PlaygroundClient, WithClientInterface['modelNames']['user']>
> {
    return Array(randomUserCount)
        .fill(0)
        .map(
            (): CreateModelEntryData<
                PlaygroundClient,
                WithClientInterface['modelNames']['user']
            > => {
                const shouldHavePosts = randomBoolean();
                const postCount = shouldHavePosts ? randomInteger({min: 1, max: 50}) : 0;

                const randomPosts = generateRandomPostData(postCount);

                return {
                    email: uuid(),
                    name: uuid(),
                    posts: {
                        // as cast because Prisma's required types are wrong
                        create: randomPosts as Writeable<typeof randomPosts>,
                    },
                };
            },
        );
}

function generateRandomPostData(
    randomPostCount: number,
): ReadonlyArray<
    Omit<
        CreateModelEntryData<PlaygroundClient, WithClientInterface['modelNames']['post']>,
        'author'
    >
> {
    return Array(randomPostCount)
        .fill(0)
        .map(
            (): Omit<
                CreateModelEntryData<PlaygroundClient, WithClientInterface['modelNames']['post']>,
                'author'
            > => {
                return {
                    title: uuid(),
                };
            },
        );
}

if (require.main === module) {
    callWithDbClient(seedFromNothing);
}
