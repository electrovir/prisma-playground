import {extractErrorMessage, isPromiseLike, typedHasOwnProperty} from 'augment-vir';

export type MaybePromise<T> =
    | (T extends Promise<infer ValueType> ? T | ValueType : Promise<T> | T)
    | undefined
    | {error: Error};

export type CreateStateUpdatingPromiseInputs<
    InnerValueGeneric,
    KeyGeneric extends PropertyKey,
    StateGeneric extends Readonly<Record<KeyGeneric, MaybePromise<InnerValueGeneric>>>,
> = {
    updateState: (newState: Partial<StateGeneric>) => void;
    stateKey: KeyGeneric;
} & (
    | {
          promiseCallback: () => Promise<InnerValueGeneric>;
          promise?: undefined;
      }
    | {
          promise: Promise<InnerValueGeneric>;
          promiseCallback?: undefined;
      }
);

export function createStateUpdatingPromiseIfUndefined<
    InnerValueGeneric,
    KeyGeneric extends PropertyKey,
    StateGeneric extends Readonly<Record<KeyGeneric, MaybePromise<InnerValueGeneric>>>,
>(
    inputs: CreateStateUpdatingPromiseInputs<InnerValueGeneric, KeyGeneric, StateGeneric> & {
        state: StateGeneric;
    },
) {
    const {state, stateKey} = inputs;
    const currentValue = state[stateKey];

    if (currentValue === undefined) {
        createStateUpdatingPromise(inputs);
    }
}

export function createStateUpdatingPromise<
    InnerValueGeneric,
    KeyGeneric extends PropertyKey,
    StateGeneric extends Readonly<Record<KeyGeneric, MaybePromise<InnerValueGeneric>>>,
>({
    updateState,
    stateKey,
    promiseCallback,
    promise,
}: CreateStateUpdatingPromiseInputs<InnerValueGeneric, KeyGeneric, StateGeneric>) {
    const output = promise ?? promiseCallback();
    // as casts below are required because, even though all the generics agree, TypeScript can't figure that out here
    if (output instanceof Promise) {
        output
            .then((result) => {
                updateState({[stateKey]: result} as Partial<StateGeneric>);
            })
            .catch((thrownError: unknown) => {
                const guaranteedError = ensureError(thrownError);
                updateState({[stateKey]: {error: guaranteedError}} as Partial<StateGeneric>);
            });
    }
    updateState({[stateKey]: output} as Partial<StateGeneric>);
}

export function awaited<ValueGeneric, FallbackGeneric, CallbackReturnGeneric>(
    input: MaybePromise<ValueGeneric>,
    notResolvedYetFallback: FallbackGeneric,
    resolvedCallback: (resolved: ValueGeneric) => CallbackReturnGeneric,
): CallbackReturnGeneric | FallbackGeneric | Error | undefined {
    console.log({input});
    if (isPromiseLike(input) || input == undefined) {
        return notResolvedYetFallback;
    } else if (typedHasOwnProperty(input, 'error')) {
        return input.error as Error;
    } else {
        return resolvedCallback(input as ValueGeneric);
    }
}

export function ensureError(input: unknown): Error {
    if (input instanceof Error) {
        return input;
    } else {
        return new Error(extractErrorMessage(input));
    }
}
