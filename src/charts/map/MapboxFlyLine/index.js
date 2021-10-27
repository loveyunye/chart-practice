import mapboxgl from 'mapbox-gl';
import { deepMerge } from '@/utils';
import {
  lineDistance,
  along,
  bearing,
  point,
  distance as DistancePoint,
} from '@turf/turf';

function uid() {
  return Math.random()
    .toFixed(6)
    .substring(2);
}
const mapBoxToken =
  'pk.eyJ1Ijoic2lzdGVyeWFuZyIsImEiOiJjanNsYzJ1NGEwcGJyNDlvYWJkMzN6NDl6In0.tcDpzwcZkaVwlPO4vwEoBg';

// mapbox
class MapFlyLine {
  static defaultOptions = {
    global: { time: 3000, units: 'kilometers' },
    router: {
      width: 2,
      opacity: 0.8,
      color: [
        { offset: 0, color: 'rgba(0, 255, 255, 0.1)' },
        { offset: 1, color: 'rgba(0, 255, 255, 0.2)' },
      ],
      show: true,
    },
    line: {
      fade: 500,
      width: 3,
      length: 300,
      opacity: 0.8,
      color: [
        { offset: 0, color: 'rgba(0, 255, 255, 0.1)' },
        { offset: 0.9, color: 'rgba(0, 255, 255, 1)' },
        { offset: 1, color: 'rgba(0, 255, 255, 0.5)' },
      ],
      show: true,
    },
    icon: {
      url:
        'http://citydo-fhl.oss-cn-hangzhou.aliyuncs.com/upload_c2ebfbca23510f323f69193d0305b4cf.png',
      size: 0.15,
      show: true,
    },
  };
  constructor(container, options) {
    this.requestID = 0;
    this.routerId = `fly-route-${uid()}`;
    this.iconId = `fly-icon-${uid()}`;
    this.lineId = `fly-line-${uid()}`;
    this.imageId = `fly-image-${uid()}`;
    this.container = container;
    this.options = deepMerge({}, MapFlyLine.defaultOptions, options);
  }

  initChart() {
    return new Promise((resolve) => {
      this.map = this.createMap();
      this.map.on('load', () => {
        console.log(this.options);
        this.setAnimate();
        // this.disableHandler(); // 禁止用户操作
        resolve();
      });
    });
  }

  async setAnimate() {
    const { line, icon } = this.options;
    window.cancelAnimationFrame(this.requestID);
    this.formatData(this.data);
    await this.addLayers();
    if (line.show || icon.show) {
      this.animate(this);
    }
  }

  visibility(layerId, visible) {
    const { map } = this;
    if (map.getLayer(layerId)) {
      // const visible = map.getLayoutProperty(layerId, 'visibility');
      map.setLayoutProperty(layerId, 'visibility', visible);
    }
  }

  // 动画
  animate(_this) {
    const {
      step,
      total,
      steps,
      routerJson,
      iconGeoJson,
      arcs,
      lineGeoJson,
    } = _this;
    const { map } = _this;
    const { line, icon, global } = _this.options;
    if (step < total) {
      _this.step++;
      if (step < steps) {
        // icon
        if (icon.show && map.getLayer(_this.iconId)) {
          iconGeoJson.features.forEach((item, index) => {
            const previous =
              routerJson.features[index].geometry.coordinates[step];
            const next =
              routerJson.features[index].geometry.coordinates[step + 1];
            if (previous && next) {
              item.properties.bearing = bearing(point(previous), point(next));
              item.geometry.coordinates = previous;
            }
          });
          map.getSource(_this.iconId).setData(iconGeoJson);
        }
        // line
        if (line.show) {
          lineGeoJson.features.forEach((item, index) => {
            const now = routerJson.features[index].geometry.coordinates[step];

            item.geometry.coordinates = arcs[index].points.filter(
              (arc, arcIndex) => {
                if (arcIndex < step && now) {
                  const arcDistance = DistancePoint(point(now), point(arc), {
                    units: global.units,
                  });
                  return arcDistance < line.length;
                } else {
                  return false;
                }
              },
            );
          });
          map.getSource(_this.lineId).setData(lineGeoJson);
        }
      } else {
        // icon none
        _this.visibility(_this.iconId, 'none');
        // line fade
        if (line.show) {
          lineGeoJson.features.forEach((item, index) => {
            const now =
              routerJson.features[index].geometry.coordinates[steps - 1];
            item.geometry.coordinates = arcs[index].points.filter(
              (arc, arcIndex) => {
                if (arcIndex < step && now) {
                  const arcDistance = DistancePoint(point(arc), point(now), {
                    units: global.units,
                  });
                  return (
                    arcDistance <
                    ((total - step) / (total - steps)) * line.length
                  );
                } else {
                  return false;
                }
              },
            );
          });
          map.getSource(_this.lineId).setData(lineGeoJson);
        }
      }
      _this.requestID = window.requestAnimationFrame(
        _this.animate.bind(_this, _this),
      );
    } else {
      window.cancelAnimationFrame(_this.requestID);
      icon.show && _this.visibility(_this.iconId, 'visible');
      _this.step = 0;
      _this.animate(_this);
    }
    _this = null;
  }

  // 添加图层
  async addLayers() {
    const { map } = this;
    // this.addRouteOrLine(map, 'router', this.routerId, this.routerJson);
    this.addRouteOrLine(map, 'line', this.lineId, this.lineGeoJson);
    // await this.addIcon(map);
    this.sortLayer();
  }

  // 排序
  sortLayer() {
    const { map } = this;
    const { routerId, lineId, iconId } = this;
    if (map.getLayer(routerId) && map.getLayer(iconId)) {
      map.moveLayer(routerId, iconId);
    }

    if (map.getLayer(routerId) && map.getLayer(lineId)) {
      map.moveLayer(routerId, lineId);
    }

    if (map.getLayer(lineId) && map.getLayer(iconId)) {
      map.moveLayer(lineId, iconId);
    }
  }

  // 添加路、线
  addRouteOrLine(map, configName, layerId, geojson) {
    const { color, width, opacity, show } = this.options[configName];
    if (!show) {
      this.visibility(layerId, 'none');
      return;
    }
    const gradient = [];
    color.forEach((item) => {
      gradient.push(item.offset);
      gradient.push(item.color);
    });
    const paint = {
      'line-width': width,
      'line-opacity': opacity,
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        ...gradient,
      ],
    };
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        source: {
          type: 'geojson',
          data: geojson,
          lineMetrics: true,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        type: 'line',
        paint,
      });
    } else {
      map.getSource(layerId).setData(geojson);
      this.setPaintProperties(map, layerId, paint);
      this.visibility(layerId, 'visible');
    }
  }

  // 添加图标
  async addIcon(map) {
    const { url, size, show } = this.options.icon;
    if (!show) {
      this.visibility(this.iconId, 'none');
      return;
    }
    try {
      await this.loadImage(map, url);
    } catch (error) {
      console.error(error);
      return;
    }
    if (!map.getLayer(this.iconId)) {
      map.addLayer({
        id: this.iconId,
        source: {
          type: 'geojson',
          data: this.iconGeoJson,
        },
        type: 'symbol',
        layout: {
          'icon-image': this.imageId,
          'icon-size': size,
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });
    } else {
      map.getSource(this.iconId).setData(this.iconGeoJson);
      map.setLayoutProperty(this.iconId, 'icon-image', this.imageId);
      map.setLayoutProperty(this.iconId, 'icon-size', size);
      this.visibility(this.iconId, 'visible');
    }
  }

  // 加载图片
  loadImage(map, url) {
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error) {
          reject(error);
        } else {
          map.hasImage(this.imageId) ? map.removeImage(this.imageId) : null;
          this.imageId = `fly-image-${uid()}`;
          map.addImage(this.imageId, image);
          resolve();
        }
      });
    });
  }

  // 设置样式属性
  setPaintProperties(map, layerId, obj) {
    Object.keys(obj).forEach((key) => {
      map.setPaintProperty(layerId, key, obj[key]);
    });
  }

  updateOptions(options) {
    this.options = deepMerge({}, this.options, options);
    this.setAnimate();
  }

  setData(data) {
    this.data = data;
    this.updateOptions(this.options);
  }

  createMap() {
    mapboxgl.accessToken = mapBoxToken;
    const map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/sisteryang/ck93wcno53jqn1jrsgt0wh8ck',
      center: [107.1, 37.2],
      zoom: 3.1,
    });
    const mapboxCon = document.querySelectorAll('.mapboxgl-control-container');
    mapboxCon.forEach((item) => {
      item.style.display = 'none';
    });
    return map;
  }

  // 数据格式
  formatData(data) {
    console.log(this.options);
    const { time, units } = this.options.global;
    const { fade, show } = this.options.line;
    this.total = ((time + (show ? fade : 0)) / 1000) * 60;
    this.steps = (time / 1000) * 60;
    this.step = 0;

    // 路
    this.routerJson = {
      type: 'FeatureCollection',
      features: [
        ...data.map((item) => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [item.from, item.to],
          },
        })),
      ],
    };
    this.arcs = this.routerJson.features.map((item) => {
      const distance = lineDistance(item, {
        units,
      });
      const arcItem = [];
      for (let i = 0; i < distance; i += distance / this.steps) {
        const segment = along(item, i, {
          units,
        });
        arcItem.push(segment.geometry.coordinates);
      }
      return {
        distance,
        points: arcItem,
      };
    });
    this.routerJson.features.forEach((item, index) => {
      item.geometry.coordinates = this.arcs[index].points;
    });
    // 线
    this.lineGeoJson = {
      type: 'FeatureCollection',
      features: [
        ...data.map((item) => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [item.from],
          },
        })),
      ],
    };
    // 图标
    this.iconGeoJson = {
      type: 'FeatureCollection',
      features: [
        ...data.map((item) => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: item.to,
          },
        })),
      ],
    };
  }

  // 删除图层
  removeLayer(...layerIds) {
    if (this.parent && this.parent.map) {
      const { map } = this.parent;
      for (let i = 0; i < layerIds.length; i++) {
        map.getLayer(layerIds[i]) && map.removeLayer(layerIds[i]);
        map.getSource(layerIds[i]) && map.removeSource(layerIds[i]);
      }
    }
  }

  destroyed() {
    window.cancelAnimationFrame(this.requestID);
    if (this && this.map) {
      this.removeLayer(this.routerId, this.lineId, this.iconId);
      this.destroyed();
    }
  }
}

export default MapFlyLine;
