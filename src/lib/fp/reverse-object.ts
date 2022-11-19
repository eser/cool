function reverseObject<T>(
  instance: Record<string | number | symbol, T>,
): Record<string | number | symbol, T> {
  return Object.keys(instance).reduce(
    (obj, itemKey) => ({ [itemKey]: instance[itemKey], ...obj }),
    {},
  );
}

export { reverseObject, reverseObject as default };
