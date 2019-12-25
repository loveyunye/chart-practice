function deepMergeOne(target, source) {
  if (typeof target !== 'object' || typeof source !== 'object') {
    return target;
  }
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (typeof sourceValue !== 'object') {
      target[key] = sourceValue;
      return;
    }
    if (typeof target[key] !== 'object') {
      target[key] = Array.isArray(sourceValue) ? [] : {};
    }
    deepMergeOne(target[key], sourceValue);
  });
  return target;
}
export const deepMerge = function(target, ...sources) {
  return sources.reduce(deepMergeOne, target);
};
