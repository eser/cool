// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

import * as functions from "@eser/standards/functions";
import * as utilities from "@eser/standards/utilities";

export const pipe = <
  // deno-lint-ignore no-explicit-any
  TF extends functions.ArgList<functions.GenericFunction<any, any>>,
>(
  ...funcs: TF
): utilities.First<TF> => {
  return funcs.reduce(
    // deno-lint-ignore no-explicit-any
    (previousFunction, currentFunction) => (...args: functions.ArgList<any>) =>
      currentFunction(previousFunction(...args)),
  );
};

export { pipe as default };
