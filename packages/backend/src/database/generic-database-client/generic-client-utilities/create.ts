import {awaitedForEach, typedHasOwnProperty, Writeable} from 'augment-vir';
import {ConcreteClientBase} from '../../../shared/database/generic-database-client/concrete-client-base';
import {
    ClientModelName,
    getGenericModel,
} from '../../../shared/database/generic-database-client/generic-model';

export type CreateModelEntryData<
    ClientGeneric extends ConcreteClientBase,
    ModelName extends ClientModelName<ClientGeneric>,
> = ClientGeneric[ModelName] extends {create: (...args: any) => any}
    ? Parameters<ClientGeneric[ModelName]['create']>[0]['data']
    : never;

// createMany is only available on specific DB types so here we abstract that
export async function createMany<
    ClientGeneric extends ConcreteClientBase,
    ModelName extends ClientModelName<ClientGeneric>,
>(
    client: ClientGeneric,
    modelName: ModelName,
    data: ReadonlyArray<CreateModelEntryData<ClientGeneric, ModelName>>,
) {
    const model = getGenericModel(client, modelName);

    if (typedHasOwnProperty(model, 'createMany') && typeof model.createMany === 'function') {
        await model.createMany({data});
    } else {
        // as cast because awaitedForEach types are wrong
        await awaitedForEach(data as Writeable<typeof data>, async (dataEntry) => {
            await model.create({data: dataEntry});
        });
    }
}
