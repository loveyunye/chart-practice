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

// 防抖
export function debounce(fn, wait = 100) {
  // 通过闭包缓存一个定时器 id
  let timer = null;
  // 将 debounce 处理结果当作函数返回
  // 触发事件回调时执行这个返回函数
  return function(...args) {
    // this保存给context
    const context = this;
    // 如果已经设定过定时器就清空上一次的定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
