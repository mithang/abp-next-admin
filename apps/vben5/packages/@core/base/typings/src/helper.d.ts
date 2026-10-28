import type { ComputedRef, MaybeRef } from 'vue';

/**
 * Tăng bộ đếm độ sâu trong đệ quy ở cấp kiểu
 */
type Increment<A extends unknown[]> = [...A, unknown];
/**
 * Đệ quy sâu: tất cả thuộc tính đều tùy chọn
 */
type DeepPartial<
  T,
  D extends number = 10,
  C extends unknown[] = [],
> = C['length'] extends D
  ? T
  : T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P], D, Increment<C>>;
      }
    : T;

/**
 * Đệ quy sâu: tất cả thuộc tính đều chỉ đọc
 */
type DeepReadonly<
  T,
  D extends number = 10,
  C extends unknown[] = [],
> = C['length'] extends D
  ? T
  : T extends object
    ? {
        readonly [P in keyof T]: DeepReadonly<T[P], D, Increment<C>>;
      }
    : T;

/**
 * Hàm bất đồng bộ với kiểu bất kỳ
 */

type AnyPromiseFunction<T extends any[] = any[], R = void> = (
  ...arg: T
) => PromiseLike<R>;

/**
 * Hàm thông thường với kiểu bất kỳ
 */
type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R;

/**
 * Hàm với kiểu bất kỳ
 */
type AnyFunction<T extends any[] = any[], R = void> =
  AnyNormalFunction<T, R> | AnyPromiseFunction<T, R>;

/**
 *  Bọc T | null
 */
type Nullable<T> = null | T;

/**
 * Bọc T | Not null
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Đối tượng kiểu chuỗi
 */
type Recordable<T> = Record<string, T>;

/**
 * Đối tượng kiểu chuỗi (chỉ đọc)
 */
interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T;
}

/**
 * Kiểu giá trị trả về của setTimeout
 */
type TimeoutHandle = ReturnType<typeof setTimeout>;

/**
 * Kiểu giá trị trả về của setInterval
 */
type IntervalHandle = ReturnType<typeof setInterval>;

/**
 * Có thể nó là một ref đã tính toán, hoặc một hàm getter
 *
 */
type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>;

/**
 * Có thể nó là một ref, hoặc một giá trị thông thường, hoặc một hàm getter
 *
 */
type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>;

type Merge<O extends object, T extends object> = {
  [K in keyof O | keyof T]: K extends keyof T
    ? T[K]
    : K extends keyof O
      ? O[K]
      : never;
};

/**
 * T = [
 *  { name: string; age: number; },
 *  { sex: 'male' | 'female'; age: string }
 * ]
 * =>
 * MergeAll<T> = {
 *  name: string;
 *  sex: 'male' | 'female';
 *  age: string
 * }
 */
type MergeAll<
  T extends object[],
  R extends object = Record<string, any>,
> = T extends [infer F extends object, ...infer Rest extends object[]]
  ? MergeAll<Rest, Merge<R, F>>
  : R;

type EmitType = (name: Name, ...args: any[]) => void;

type MaybePromise<T> = Promise<T> | T;

export type {
  AnyFunction,
  AnyNormalFunction,
  AnyPromiseFunction,
  DeepPartial,
  DeepReadonly,
  EmitType,
  IntervalHandle,
  MaybeComputedRef,
  MaybePromise,
  MaybeReadonlyRef,
  Merge,
  MergeAll,
  NonNullable,
  Nullable,
  ReadonlyRecordable,
  Recordable,
  TimeoutHandle,
};
