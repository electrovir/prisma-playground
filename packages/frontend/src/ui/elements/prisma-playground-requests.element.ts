import {Post, User} from '@electrovir/database/src/prisma/prisma-types';
import {defineElement, html} from 'element-vir';
import {fetchPosts, fetchUsers} from '../../network/database-access/request';
import {subscribeToMessages} from '../../network/database-access/subscription';
import {awaited, createStateUpdatingPromiseIfUndefined, MaybePromise} from '../promise-resolver';

export const PrismaPlaygroundRequestsElement = defineElement<{role: string}>()({
    tagName: 'prisma-playground-requests',
    stateInit: {
        users: undefined as MaybePromise<User[]>,
        posts: undefined as MaybePromise<Post[]>,
        currentMessage: '',
    },
    initCallback: ({updateState, inputs}) => {
        function updateCurrentMessage(currentMessage: string) {
            updateState({currentMessage});
        }
        subscribeToMessages(inputs.role, updateCurrentMessage);
    },
    renderCallback: ({inputs, state, updateState}) => {
        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'users',
            promiseCallback: () => fetchUsers(inputs.role),
        });

        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'posts',
            promiseCallback: () => {
                console.log(inputs.role);
                return fetchPosts(inputs.role);
            },
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
