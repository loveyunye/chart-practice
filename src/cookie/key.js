const ChartKey = 'chart-key';

export function getKey() {
  return sessionStorage.getItem(ChartKey);
}

export function setKey(key) {
  return sessionStorage.setItem(ChartKey, key);
}

export function removeKey() {
  sessionStorage.removeItem(ChartKey);
}
