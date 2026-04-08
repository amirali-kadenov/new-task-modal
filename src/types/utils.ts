export type ValueOf<T> = T[keyof T]

export type VariantsRecord<T extends string> = Record<T, T>
