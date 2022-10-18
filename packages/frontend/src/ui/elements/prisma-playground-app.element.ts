import {Post, User} from '@electrovir/database/src/prisma/prisma-types';
import {defineElementNoInputs, html} from 'element-vir';
// import {fetchUsers} from '../../network/database-access/request';
import '../../network/database-access/request';
import {fetchPosts, fetchUsers} from '../../network/database-access/request';
import {awaited, createStateUpdatingPromiseIfUndefined, MaybePromise} from '../promise-resolver';

export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    stateInit: {
        users: undefined as MaybePromise<User[]>,
        posts: undefined as MaybePromise<Post[]>,
        currentMessage: '',
    },
    initCallback: ({updateState}) => {
        function updateCurrentMessage(currentMessage: string) {
            updateState({currentMessage});
        }
        // subscribeToMessages(updateCurrentMessage);
    },
    renderCallback: ({state, updateState}) => {
        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'users',
            promiseCallback: fetchUsers,
        });

        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'posts',
            promiseCallback: fetchPosts,
        });

        return html`
            <h2>Random Message</h2>
            <div>Message: ${state.currentMessage}</div>
            <span>
                ${awaited(state.users, 'Loading...', (users) => {
                    return html`
                        <h2>Users</h2>
                        <table>
                            ${users.map((user) => {
                                return html`
                                    <tr>
                                        <th>id</th>
                                        <td>${user.id}</td>
                                    </tr>
                                `;
                            })}
                        </table>
                    `;
                })}
                <p>Should have an error below (this is caused by the auth check failing)</p>
                ${awaited(state.posts, 'Loading...', (posts) => {
                    return html`
                        <h2>Posts</h2>
                        <table>
                            ${posts.map((post) => {
                                return html`
                                    <tr>
                                        <th>id</th>
                                        <td>${post.id}</td>
                                    </tr>
                                `;
                            })}
                        </table>
                    `;
                })}
            </span>
        `;
    },
});
