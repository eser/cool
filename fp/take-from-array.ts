// Copyright 2023 the cool authors. All rights reserved. Apache-2.0 license.

export const takeFromArray = <T>(
  instance: Iterable<T>,
  n: number,
): Array<T> => {
  const arrInstance = (instance.constructor === Array)
    ? <ReadonlyArray<T>> instance
    : [...instance];

  return arrInstance.slice(0, n);
};

export { takeFromArray as default };
