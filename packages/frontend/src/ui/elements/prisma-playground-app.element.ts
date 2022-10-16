import {User} from '@prisma/client';
import {defineElementNoInputs, html} from 'element-vir';
// import {fetchUsers} from '../../network/database-access/request';
import '../../network/database-access/request';
import {fetchUsers} from '../../network/database-access/request';
import {subscribeToCurrentNumber} from '../../network/database-access/subscription';
import {awaited, createStateUpdatingPromiseIfUndefined, MaybePromise} from '../promise-resolver';

export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    stateInit: {
        users: undefined as MaybePromise<User[]>,
        currentNumber: -1,
    },
    initCallback: ({updateState}) => {
        function updateCurrentNumber(currentNumber: number) {
            updateState({currentNumber});
        }
        subscribeToCurrentNumber(updateCurrentNumber).then(updateCurrentNumber);
    },
    renderCallback: ({state, updateState}) => {
        createStateUpdatingPromiseIfUndefined({
            state,
            updateState,
            stateKey: 'users',
            promiseCallback: fetchUsers,
        });

        return html`
            <span>
                ${awaited(state.users, 'Loading...', (users) => {
                    return html`
                        <div>Current number: ${state.currentNumber}</div>
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
