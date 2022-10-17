import {Post, User} from '@prisma/client';
import {defineElementNoInputs, html} from 'element-vir';
// import {fetchUsers} from '../../network/database-access/request';
import '../../network/database-access/request';
import {fetchPosts, fetchUsers} from '../../network/database-access/request';
import {subscribeToMessages} from '../../network/database-access/subscription';
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
        subscribeToMessages(updateCurrentMessage);
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
            <span>
                ${awaited(state.users, 'Loading...', (users) => {
                    return html`
                        <h2>Incrementing number</h2>
                        <div>Message: ${state.currentMessage}</div>
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
