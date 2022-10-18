import {assign, css, defineElementNoInputs, html} from 'element-vir';
// import {fetchUsers} from '../../network/database-access/request';
import '../../network/database-access/request';
import {PrismaPlaygroundRequestsElement} from './prisma-playground-requests.element';

const roles = [
    '',
    'nothing',
    'peasant',
    'lord',
    'king',
];

export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    styles: css`
        :host {
            display: flex;
            padding: 0 32px;
        }

        .request-wrapper {
            flex-basis: 0;
            flex-grow: 1;
        }
    `,
    renderCallback: () => {
        return html`
            ${roles.map((role) => {
                return html`
                    <div class="request-wrapper">
                        <h1>Auth Role = ${role}</h1>
                        <${PrismaPlaygroundRequestsElement}
                            ${assign(PrismaPlaygroundRequestsElement, {
                                role,
                            })}
                        ></${PrismaPlaygroundRequestsElement}>
                    </div>
                `;
            })}
        `;
    },
});
