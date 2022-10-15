import {Prisma} from '@prisma/client';
import {getObjectTypedKeys, getObjectTypedValues} from 'augment-vir';
import {ConcreteClientBase} from './concrete-client-base';

// https://github.com/prisma/prisma/issues/11940#issuecomment-1049572440
type IgnorePrismaBuiltins<PrismaClientKeyUnionGeneric extends string> =
    string extends PrismaClientKeyUnionGeneric
        ? string
        : PrismaClientKeyUnionGeneric extends ''
        ? PrismaClientKeyUnionGeneric
        : PrismaClientKeyUnionGeneric extends `$${string}` | `_${string}`
        ? never
        : PrismaClientKeyUnionGeneric;

export type ClientModelName<ClientGeneric extends ConcreteClientBase> =
    keyof ClientGeneric extends string ? IgnorePrismaBuiltins<keyof ClientGeneric> : never;

export type ClientModelNamesEnum<ClientGeneric extends ConcreteClientBase> = Readonly<{
    [ModelName in ClientModelName<ClientGeneric>]: ModelName;
}>;

export function makeModelNameEnum<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
): ClientModelNamesEnum<ClientGeneric> {
    const modelNames = getObjectTypedKeys(client);

    const formedEnum = modelNames.reduce((allKeys, prismaKey) => {
        if (isPrismaModelName(client, prismaKey)) {
            return {
                ...allKeys,
                [prismaKey]: prismaKey,
            };
        }
        return allKeys;
    }, {} as ClientModelNamesEnum<ClientGeneric>);

    return formedEnum;
}

export function getModelNames<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
): ClientModelName<ClientGeneric>[] {
    return getObjectTypedValues(makeModelNameEnum(client));
}

export function isPrismaModelName<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
    input: PropertyKey,
): input is ClientModelName<ClientGeneric> {
    return (
        typeof input === 'string' &&
        !!input &&
        !input.startsWith('$') &&
        !input.startsWith('_') &&
        client.hasOwnProperty(input)
    );
}

export type GenericModelClient<ClientGeneric extends ConcreteClientBase> = Record<
    ClientModelName<ClientGeneric>,
    GenericModel
>;

export type GenericClientWithModelName<
    ClientGeneric extends ConcreteClientBase,
    ModelName extends ClientModelName<ClientGeneric>,
> = Record<ModelName, GenericModel>;

export type GenericModel = Prisma.PostDelegate<any>;

export function getGenericModel<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
    modelName: ClientModelName<ClientGeneric>,
): GenericModel {
    return client[modelName] as GenericModel;
}

export async function mapForEachModel<
    ClientGeneric extends ConcreteClientBase,
    CallbackReturnGeneric,
>(
    client: ClientGeneric,
    callback: (
        model: GenericModel,
        modelName: ClientModelName<ClientGeneric>,
    ) => Promise<CallbackReturnGeneric>,
): Promise<ReadonlyArray<CallbackReturnGeneric>> {
    const modelNames = getModelNames(client);

    return await Promise.all(
        modelNames.map(async (modelName) => {
            const model = getGenericModel(client, modelName);

            return callback(model, modelName);
        }),
    );
}
