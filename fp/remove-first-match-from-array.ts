// Copyright 2023 the cool authors. All rights reserved. Apache-2.0 license.

export const removeFirstMatchFromArray = <T>(
  instance: Iterable<T>,
  predicate: (value: T, index: number, instance: Iterable<T>) => boolean,
): Array<T> => {
  const arrInstance = (instance.constructor === Array)
    ? <ReadonlyArray<T>> instance
    : [...instance];

  let notFound = true;

  return arrInstance.filter((itemValue, itemKey, obj) => {
    if (notFound && predicate(itemValue, itemKey, obj)) {
      notFound = false;

      return false;
    }

    return true;
  });
};

export { removeFirstMatchFromArray as default };
