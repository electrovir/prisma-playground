import {User} from '@prisma/client';
import {isPromiseLike} from 'augment-vir';
import {defineElementNoInputs, html} from 'element-vir';
import {fetchUsers} from '../../network/database-access/request';
import {awaited, createStateUpdatingPromiseIfUndefined, MaybePromise} from '../promise-resolver';

export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    stateInit: {
        users: undefined as MaybePromise<User[]>,
    },
    renderCallback: ({state, updateState}) => {
        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'users',
            promiseCallback: fetchUsers,
        });

        if (!isPromiseLike(state.users)) {
            console.log(state.users);
        }

        return html`
            <span>
                ${awaited(state.users, 'Loading...', (users) => {
                    return html`
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
            </span>
        `;
    },
});
