import { deepMerge } from '@/utils';

const AMap = window.AMap;
// GaoDe
class MapFlow {
  static defaultOptions = {
    fitScreen: true,
    line: {
      strokeColor: '#82F',
      strokeOpacity: 1,
      strokeWeight: 8,
    },
    flow: {
      type: 'arrow', // box , arrow 类型
      //  当使用 box 时需留意地图上变化，理解下width、height的旋转后位置
      //  当使用 arrow 时需将width、height保持一致，才能拥有箭头形状
      width: 6, // 宽
      height: 6, // 长
      color: '#fff',
      border: 2, // 搭配arrow使用
    },
    config: {
      speed: 600, // 千米/小时
      interval: 800, // 每个滑块间隔时间 ms
    },
  };

  constructor(container = null, options = {}, map = null) {
    this.map = null;
    this.markers = [];
    this.timer = null; // 循环时间要素
    this.timerOut = null; // 延迟时间要素
    this.line = null;
    this.summary = null; // 汇总数据：总长度、每段长度
    this.content = null; // marker 的 content

    if (map) {
      this.map = map;
    } else if (container) {
      this.map = new AMap.Map(container, {
        zoom: 16,
        center: [114.423783, 27.800172],
      });
    }
    if (this.map) {
      this.map.setLayers([new AMap.TileLayer.Satellite()]);
    }
    this.options = deepMerge({}, MapFlow.defaultOptions, options);
  }

  // 执行函数
  setData(data, options = {}) {
    this.options = deepMerge({}, this.options, options);
    this.setMarkerContent(); // 设置content样式

    if (this.timer) {
      clearInterval(this.timer);
      clearInterval(this.timerOut);
    }
    if (Array.isArray(data) && this.map) {
      this.data = data;
      this.summary = this.getSummary();
      this.clearHandler();
      this.setLine();
      this.initMarkers();
    }
  }

  // 初始化图标
  initMarkers() {
    const { amidPoints, allPoints, gapTime } = this.getInitData();
    this.markers = amidPoints.reverse().map((i) => {
      const index = allPoints.findIndex((a) => a[0] === i[0] && a[1] === a[1]);
      return this.getMarkerAnimate(allPoints.slice(index));
    });
    setTimeout(() => {
      console.log('删除最后一个');
      // this.map.remove(this.markers.splice(0, 1));
    }, gapTime);
    this.timerOut = setTimeout(() => {
      this.loopAnimate();
    }, 800);
  }

  // 循环运动
  loopAnimate() {
    const { distance } = this.summary;
    const { speed, interval } = this.options.config;
    const lngLats = this.data;

    const time = (distance / speed) * 3.6;
    this.markers = [...this.markers, this.getMarkerAnimate(lngLats)];
    this.map.remove(this.markers.splice(0, 1));
    const loopIndex = Math.ceil((time * 1000) / interval) + 1; // +1代表当跑完有新加入进行删除
    this.timer = setInterval(() => {
      const marker = this.getMarkerAnimate(lngLats);
      this.markers.push(marker);
      if (this.markers.length >= loopIndex) {
        const delMarkers = this.markers.splice(0, 1);
        this.map.remove(delMarkers);
      }
    }, interval);
  }

  // 获取可移动的marker
  getMarkerAnimate(points, animate = true, position = false) {
    const { speed } = this.options.config;
    const marker = new AMap.Marker({
      map: this.map,
      autoRotation: true,
      content: this.content,
      offset: new AMap.Pixel(0, 0),
      ...(position && points.length
        ? { position: new AMap.LngLat(...points[0]) }
        : {}),
    });
    // speed 千米/小时
    if (animate && points.length) {
      marker.moveAlong(points, speed);
    }
    return marker;
  }

  // 根据 flow-滑块 设置样式
  setMarkerContent() {
    const { type, width, height, border, color } = this.options.flow;
    let flowStyle;
    if (type === 'box') {
      flowStyle = `
        transform: translate(-50%,-50%);
        background-color: ${color};
      `;
    } else {
      flowStyle = `
        border-bottom: ${border}px solid ${color};
        border-right: ${border}px solid ${color};
        transform: translate(-50%,-50%) rotate(-45deg);
      `;
    }
    this.content = `
        <div style="
          width: ${width}px;
          height: ${height}px;
          box-sizing: border-box;
          position: absolute;
          left: 0%;
          top: 0%;
          ${flowStyle}
        "></div>
      `;
  }

  // 获取初始化数据
  getInitData() {
    const lngLats = [...this.data];
    const { distance, distances } = this.summary;
    const { speed, interval } = this.options.config;

    const time = (distance / speed) * 3.6; // 跑完一圈花费的时间
    const loopIndex = Math.ceil((time * 1000) / interval); // 跑一圈的个数
    const lineSp = (speed / 3.6) * (interval / 1000); // 每段距离 米 m/s * s
    // 所有点位
    const allPoints = [...lngLats];
    // 中间的点位
    const amidPoints = Array.from(new Array(loopIndex)).map((n, index) => {
      const currentLine = index * lineSp;
      let lngLat;
      for (let i = 0; i < lngLats.length; i++) {
        if (currentLine === 0) {
          lngLat = lngLats[0];
          break;
        }
        const summary = distances
          .slice(0, i + 1)
          .reduce((pre, next) => pre + next); // 当前总线段长度
        if (currentLine <= summary) {
          const summaryPre = distances
            .slice(0, i)
            .reduce((pre, next) => pre + next); // 之前线段长度
          const currentDis = distances[i]; // 当前线段长度
          const diff = currentLine - summaryPre; // 相差距离
          const preP = lngLats[i - 1]; // 上一个坐标点位
          const nextP = lngLats[i]; // 当前坐标点位
          const diffRatio = diff / currentDis; // 相差x、y倍数
          lngLat = [
            preP[0] + (nextP[0] - preP[0]) * diffRatio,
            preP[1] + (nextP[1] - preP[1]) * diffRatio,
          ];
          // 一段线中存在多个点
          if (diff > lineSp) {
            const nextIndex = allPoints.findIndex(
              (p) => p[0] === nextP[0] && p[1] === nextP[1],
            );
            allPoints.splice(nextIndex, 0, lngLat);
          } else {
            const preIndex = allPoints.findIndex(
              (p) => p[0] === preP[0] && p[1] === preP[1],
            );
            allPoints.splice(preIndex + 1, 0, lngLat);
          }
          break;
        } else {
          // 长度不够时、继续往下取距离
          continue;
        }
      }
      return lngLat;
    });
    const gapTime = ((distance - lineSp * (loopIndex - 1)) / lineSp) * interval;
    return {
      allPoints,
      amidPoints,
      gapTime,
    };
  }

  // 获取汇总数据
  getSummary() {
    return this.data.reduce(
      (pre, next) => {
        const distance = AMap.GeometryUtil.distance(
          new AMap.LngLat(...pre.lngLat),
          new AMap.LngLat(...next),
        );
        return {
          lngLat: next,
          distance: pre.distance + distance,
          distances: [...pre.distances, distance],
        };
      },
      {
        lngLat: this.data[0],
        distance: 0,
        distances: [],
      },
    );
  }

  // 画底部线条
  setLine() {
    if (this.line) {
      this.map.remove([this.line]);
    }
    const { line } = this.options;
    this.line = new AMap.Polyline({
      map: this.map,
      path: [...this.data],
      ...line,
    });
  }

  // 清楚操作
  clearHandler() {
    this.timer && this.clearInterval(this.timer);
    this.timerOut && this.clearInterval(this.timer);
    // this.map.remove([...this.markers, this.line]);
    this.map.remove(this.markers);
  }

  destroyed() {
    this.clearHandler();
  }
}

export default MapFlow;
