<template>
  <div class="layout">
    <layout-header></layout-header>
    <div class="body">
      <layout-menu></layout-menu>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './components/LayoutHeader'
import LayoutMenu from './components/LayoutMenu'

export default {
  components: {
    LayoutHeader,
    LayoutMenu
  }
}
</script>

<style lang="stylus" scoped>
.layout {
  position: relative;
  padding-top: 62px;
}
.body {
  width: 100%;
  display: flex;
}
.container {
  padding: 5px 20px 20px;
  min-width: 0;
  flex-grow: 1;
  background: #fff;
}
</style>
