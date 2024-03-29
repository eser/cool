// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

export const mapArray = <T1, T2>(
  instance: Iterable<T1>,
  predicate: (value: T1, index: number, instance: Iterable<T1>) => T2,
): Array<T2> => {
  const arrInstance = (instance.constructor === Array)
    ? <ReadonlyArray<T1>> instance
    : [...instance];

  return arrInstance.map(predicate);
};

export { mapArray as default };
