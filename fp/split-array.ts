export type SplitArrayResult<T> = { items: T[]; rest: T[] };

export const splitArray = <T>(
  instance: Iterable<T>,
  n: number,
): SplitArrayResult<T> => {
  const arrInstance = (instance.constructor === Array)
    ? <T[]> instance
    : [...instance];

  // take n items
  return {
    items: arrInstance.slice(0, n),
    rest: arrInstance.slice(n),
  };
};

export { splitArray as default };
