declare type Nullable<T> = T | null;
declare type Unidentifiable<T> = T | undefined;
declare type ReturnSelector<P, R> = (state: P) => R | undefined | null;
declare type FirstTypeOfArray<T> = T extends (infer U)[] ? U : null;
declare type ValueOf<T> = T[keyof T];
