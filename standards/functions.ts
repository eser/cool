// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

// deno-lint-ignore no-explicit-any
export type ArgList = ReadonlyArray<any>;
// deno-lint-ignore no-explicit-any
export type GenericFunction<T = any> = (...args: ArgList) => T;
// deno-lint-ignore no-explicit-any
export type GenericClass<T = any> = new (...args: ArgList) => T;

export const nullAsyncGeneratorFn = async function* <TR>(): AsyncGenerator<
  TR
> {};
export const AsyncGeneratorFunction = nullAsyncGeneratorFn.constructor;

export const nullGeneratorFn = function* <TR>(): Generator<TR> {};
export const GeneratorFunction = nullGeneratorFn.constructor;

export const nullAsyncFn = async function <TR = void>(): Promise<TR | void> {};
export const AsyncFunction = nullAsyncFn.constructor;

export const nullFn = function <TR = void>(): TR | void {};
export const Function = globalThis.Function;
