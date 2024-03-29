// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

export const reverseObject = <T>(
  instance: Record<string | number | symbol, T>,
): Record<string | number | symbol, T> => {
  return Object.entries(instance).reduce(
    (obj, [itemKey, value]) => ({ [itemKey]: value, ...obj }),
    {},
  );
};

export { reverseObject as default };
