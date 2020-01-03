import Cookie from 'js-cookie';

const ChartGrid = 'chart-grid';

export function getGrid() {
  return Cookie.get(ChartGrid);
}

export function setGrid(value) {
  return Cookie.set(ChartGrid, value);
}

export function removeGrid() {
  return Cookie.remove(ChartGrid);
}
