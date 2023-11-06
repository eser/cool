// Copyright 2023 the cool authors. All rights reserved. Apache-2.0 license.

export const appendToObject = <T>(
  instance: Record<string | number | symbol, T>,
  ...values: ReadonlyArray<Record<string | number | symbol, T>>
): Record<string | number | symbol, T> => {
  return Object.assign({}, instance, ...values);
};

export { appendToObject as default };
