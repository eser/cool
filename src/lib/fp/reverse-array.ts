function reverseArray<T>(instance: Iterable<T>): T[] {
  const arrInstance = (instance.constructor === Array)
    ? <T[]> instance
    : [...instance];

  return arrInstance.reduce(
    (obj: readonly T[], itemValue: T) => [itemValue, ...obj],
    [],
  );
}

export { reverseArray, reverseArray as default };
