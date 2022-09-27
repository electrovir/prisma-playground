import {defineElementNoInputs, html} from 'element-vir';
import {getUsers} from '../../network/database-access/user';
getUsers;
export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    renderCallback: () => html`
        <span>Hello there!</span>
    `,
});
