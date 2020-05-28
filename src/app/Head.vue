<template>
  <div class="head-wrapper">
    <div class="logo">CHART PARCTICE</div>
    <div class="link">
      <a href="/game.html">扫雷</a>
      <a href="/game1.html">贪吃蛇</a>
    </div>
  </div>
</template>
<style lang="less" scoped>
.head-wrapper {
  height: 70px;
  background-color: #1c2139;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .logo {
    font-size: 2.4rem;
    height: 3rem;
    line-height: 3rem;
    font-weight: 600;
    background-image: linear-gradient(0deg, #7349be 0%, #e57d84 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .link {
    a {
      margin-left: 10px;
      color: #ffffff;
    }
  }
}
</style>
