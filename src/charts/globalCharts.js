/**
 * 全局组件 和 chart组件
 */
import store from '../store';
import defaultIcon from './icon.png';
import defaultConfig from './defaultConfig.json';
import { deepMerge } from '../utils';

const requireComponent = require.context(
  '.',
  true,
  /\.(\/[\u4e00-\u9fa5_a-zA-Z0-9]+)?\/index\.js$/,
);
const requireIcons = require.context(
  '.',
  true,
  /\.(\/[\u4e00-\u9fa5_a-zA-Z0-9]+)?\/icon\.png$/,
);

const requireConfig = require.context(
  '.',
  true,
  /\.(\/[\u4e00-\u9fa5_a-zA-Z0-9]+)?\/package\.json$/,
);

const chartLists = [];
requireComponent.keys().forEach((path) => {
  /**
   * 处理icon
   */
  console.log();
  let icon;
  const iconPath = requireIcons
    .keys()
    .filter((item) => item === path.replace('index.js', 'icon.png'));
  if (iconPath.length > 0) {
    icon = requireIcons(iconPath[0]);
  }
  /**
   * 处理默认配置
   */
  let config = {};
  const configPath = requireConfig
    .keys()
    .filter((item) => item === path.replace('index.js', 'package.json'));
  if (configPath.length > 0) {
    try {
      config = requireConfig(configPath[0]);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   *  保存至store
   */
  if (path !== './globalCharts.js') {
    const chart = requireComponent(path);
    chartLists.push({
      chart: chart.default || chart,
      icon: icon || defaultIcon,
      config: deepMerge({}, defaultConfig, config),
      key: path.split('/')[1],
    });
  }
});
store.dispatch('screen/listHandler', chartLists);
store.dispatch('chart/setCurrentChart', chartLists[0]);
