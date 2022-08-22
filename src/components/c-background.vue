<template>
  <div class="bg-warpper">
    <div class="bg-item bg-item1"></div>
    <div class="bg-item bg-item2"></div>
    <div class="bg-item bg-item3"></div>
    <div class="bg-item bg-item4"></div>
    <div class="bg"></div>
  </div>
</template>

<style lang="stylus" scoped>
.bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #F0F3F8;
  opacity: 0.8;
}

.bg-item {
  position: fixed;
  border-radius: 50%;
  filter: blur(30px);
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    /* 在此设置专门针对IE10和IE11的样式 */
    display: none;
  }
}
.bg-item1 {
  height: 300px;
  width: 300px;
  background-color: rgba(252,184,19,.5);
  top: 50px;
  left: -210px;
}
.bg-item2 {
  height: 400px;
  width: 400px;
  background-color: rgba(8,135,255,.5);
  top: -200px;
  right: -200px;
}
.bg-item3 {
  height: 450px;
  width: 450px;
  background-color: rgba(8,135,255,.5);
  bottom: -30px;
  left: 20px;
}
.bg-item4 {
  height: 450px;
  width: 450px;
  background-color: rgba(255,192,203,.5);
  bottom: 100px;
  right: -50px;
}
</style>
