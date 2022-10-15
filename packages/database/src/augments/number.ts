type PrependNextNumber<ArrayGeneric extends Array<unknown>> =
    ArrayGeneric['length'] extends infer inferredLength
        ? ((length: inferredLength, ...array: ArrayGeneric) => void) extends (
              ...nestedLength: infer NestedInferredLength
          ) => void
            ? NestedInferredLength
            : never
        : never;

type TraverseRange<ArrayGeneric extends Array<unknown>, NextNumber extends number> = {
    0: ArrayGeneric;
    1: TraverseRange<PrependNextNumber<ArrayGeneric>, NextNumber>;
}[NextNumber extends ArrayGeneric['length'] ? 0 : 1];

export type RangeFromZero<NumberGeneric extends number> = TraverseRange<
    [],
    NumberGeneric
> extends (infer InferRange)[]
    ? InferRange
    : never;

export type Range<From extends number, To extends number> = Exclude<
    RangeFromZero<To>,
    RangeFromZero<From>
>;
