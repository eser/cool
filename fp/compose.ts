// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import { type ArgList, type GenericFunction } from "../standards/functions.ts";

type ComposableFunction = GenericFunction;

export const compose = (
  ...funcs: ReadonlyArray<ComposableFunction>
): ComposableFunction => {
  return funcs.reduce(
    (previousFunction, currentFunction) => (...args: ArgList) =>
      previousFunction(currentFunction(...args)),
  );
};

export { compose as default };
