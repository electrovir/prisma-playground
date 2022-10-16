import {defineElementNoInputs, html} from 'element-vir';

export const PrismaPlaygroundUsersElement = defineElementNoInputs({
    tagName: 'prisma-playground-users',
    renderCallback: () => html`
        <span>Hello there!</span>
    `,
});
