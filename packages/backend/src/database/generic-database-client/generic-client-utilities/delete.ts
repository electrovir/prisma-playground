import {ConcreteClientBase} from '../../../shared/database/generic-database-client/concrete-client-base';
import {mapForEachModel} from '../../../shared/database/generic-database-client/generic-model';

export async function clearDatabase<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
) {
    await mapForEachModel(client, async (model) => {
        await model.deleteMany();
    });
}

export async function assertAllModelsAreEmpty<ClientGeneric extends ConcreteClientBase>(
    client: ClientGeneric,
): Promise<void> {
    await mapForEachModel(client, async (model, modelName) => {
        const tableRowCount = await model.count();
        if (tableRowCount) {
            throw new Error(`Found existing data in model "${modelName}"`);
        }
    });
}
