import {
    CallExpression,
    createScalarField,
    createSchema,
    Model,
    ScalarType,
    UUID,
} from '@electrovir/prisma-schema-dsl';

function createPlaygroundSchema() {
    const models: Model[] = [
        {
            name: 'user',
            fields: [
                createScalarField({
                    name: 'id',
                    type: ScalarType.String,
                    defaultValue: new CallExpression(UUID),
                    isId: true,
                    isRequired: true,
                }),
                createScalarField({
                    name: 'email',
                    type: ScalarType.String,
                    isUnique: true,
                    isRequired: true,
                }),
                createScalarField({
                    name: 'name',
                    type: ScalarType.String,
                }),
            ],
        },
    ];
    createSchema({
        models,
        enums: [],
    });
}
