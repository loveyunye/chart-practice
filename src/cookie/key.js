import Cookie from 'js-cookie';

const ChartKey = 'chart-key';

export function getKey() {
  return Cookie.get(ChartKey);
}

export function setKey(key) {
  return Cookie.set(ChartKey, key);
}

export function removeKey() {
  return Cookie.remove(ChartKey);
}
