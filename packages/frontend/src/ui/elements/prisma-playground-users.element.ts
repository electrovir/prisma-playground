import {defineElementNoInputs, html} from 'element-vir';

export const PrismaPlaygroundAppElement = defineElementNoInputs({
    tagName: 'prisma-playground-app',
    renderCallback: () => html`
        <span>Hello there!</span>
    `,
});
