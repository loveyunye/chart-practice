<template>
  <div class="map-mask-wrapper">
    <div id="container" />
    <div id="myPageTop">
      <div class="title">请输入关键字搜索：</div>
      <input id="tipinput" placeholder="关键字搜索" />
    </div>
    <div class="text">
      <div class="main">
        <!-- <div>{{ lngLatText }}</div> -->
        <!-- <div>{{ companyAddress }}</div> -->
        <div>选中的坐标组： {{ lngLats }}</div>
      </div>
      <div class="btn">
        <button size="small" @click="handler(false)">取消</button>
        <button
          :disabled="!lngSelf || !latSelf"
          size="small"
          type="primary"
          @click="handler(true)"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null,
      marker: null,
      geocoder: null,
      companyAddress: '',
      lngSelf: '',
      latSelf: '',

      lngLats: [],
    };
  },
  computed: {
    lngLatText() {
      return this.lngSelf && this.latSelf
        ? `您在地图选择了 [${this.lngSelf}，${this.latSelf}] 的位置！`
        : '请点击地图定位';
    },
  },
  async mounted() {
    if (!window.AMap) {
      await this.loadMap();
      await this.addPlugin('AMap.Autocomplete');
      await this.addPlugin('AMap.PlaceSearch');
      await this.addPlugin('AMap.Geocoder');
    }
    this.initMap();
  },
  methods: {
    handler(confirm) {
      console.log(this.lngSelf, this.latSelf, this.companyAddress);
      if (confirm) {
        this.$emit('change', this.lngSelf, this.latSelf, this.companyAddress);
      }
      // this.$emit('close', false);
    },
    loadMap() {
      return new Promise((resolve) => {
        const url =
          'https://webapi.amap.com/maps?v=1.4.15&key=8cf19d091af642031d99a44b3e607c6c&callback=onMap';
        const jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
        window.onMap = function() {
          resolve();
        };
      });
    },
    // 添加插件
    addPlugin(pluginName) {
      return new Promise((resolve) => {
        window.AMap.plugin(pluginName, function() {
          resolve();
        });
      });
    },
    setMarker(lng = '', lat = '', init = false) {
      this.lngSelf = lng;
      this.latSelf = lat;
      if (!lng || !lat) {
        this.companyAddress = '';
        return;
      }
      const AMap = window.AMap;
      const { map, marker, geocoder } = this;
      if (!map) {
        this.initMap();
      }
      if (init) {
        map.setCenter(new AMap.LngLat(lng, lat));
      }
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          this.companyAddress = address;
        }
      });
      marker.setPosition(new AMap.LngLat(lng, lat));
      marker.setMap(map);
    },
    initMap() {
      const AMap = window.AMap;
      // 地图加载
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 30,
        showBuildingBlock: false,
      });
      // 标记
      //  geoCoder
      this.geocoder = new AMap.Geocoder({});
      const { map } = this;
      map.on('click', (e) => {
        this.lngLats.push([e.lnglat.getLng(), e.lnglat.getLat()]);
        const marker = new AMap.Marker({
          icon: '//vdata.amap.com/icons/b18/1/2.png',
          position: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()),
        });
        marker.setMap(map);
      });

      // 输入提示
      const auto = new AMap.Autocomplete({
        input: 'tipinput',
      });
      const placeSearch = new AMap.PlaceSearch({ map, pageSize: 1 }); // 构造地点查询类
      AMap.event.addListener(auto, 'select', (e) => {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name); // 关键字查询查询
      }); // 注册监听，当选中某条记录时会触发
    },
  },
};
</script>
<style lang="less" scoped>
.map-mask-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1001;
  color: #000;
  #container {
    border-radius: 4px;
    width: 100%;
    height: 100vh;
    margin: auto;
    // margin-top: 10vh;
  }

  /deep/ .amap-logo {
    display: none;
    visibility: hidden;
  }
  /deep/ .amap-copyright {
    display: none;
    visibility: hidden !important;
  }

  .text {
    border-radius: 4px;
    padding: 10px;
    width: 360px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: #ffffff;
    box-shadow: 6px 4px 10px 1px rgba(0, 0, 0, 0.5);
    & > div.btn {
      text-align: right;
    }
    .main {
      height: 60px;
      padding-bottom: 20px;
      line-height: 20px;
      div:nth-child(1) {
        color: #000;
        padding-bottom: 2px;
      }
    }
  }

  #myPageTop {
    padding: 10px;
    width: 260px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 6px 4px 10px 1px rgba(0, 0, 0, 0.2);

    div.title {
      color: #4a75d0;
      font-size: 16px;
      font-weight: 800;
    }
    input {
      margin-top: 10px;
      height: 30px;
      border: none;
      outline: none;
      width: 100%;
    }
  }
}
</style>
