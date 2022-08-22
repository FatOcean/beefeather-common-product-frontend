<template>
  <div :class="['layout-menu', isCollapse && 'is-collapse']">
    <lls-menu
      :default-active="activePath"
      :isCollapse="isCollapse"
      show-collapse-btn
      transparent
      @select="handleSelect"
      @collapse-btn-click="handleClick">
      <lls-menu-item v-for="r in layoutRoutes" :key="r.meta.path" :index="r.path">
        <svg-icon :icon-class="activePath === r.path ? r.meta.activeIcon : r.meta.icon" class-name="menu-icon"></svg-icon>
        <span slot="title">{{ r.meta.title }}</span>
      </lls-menu-item>
    </lls-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      activePath: '',
      isCollapse: false
    }
  },

  computed: {
    ...mapGetters(['layoutRoutes'])
  },

  methods: {
    handleSelect (index) {
      if (this.activePath !== index) {
        this.activePath = index
        this.$router.push(index)
      }
    },
    handleClick (b) {
      this.isCollapse = b
    }
  },

  created () {
    this.layoutRoutes.find((r) => {
      if (this.$route.path === '/' + r.path) {
        this.activePath = r.path
        return true
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.layout-menu {
  width: 208px;
  flex-shrink: 0;
  transition: .2s;
  &.is-collapse {
    width: 56px;
  }
}
.lls-menu-warpper {
  position: fixed;
  left: 0;
  top: 62px;
  bottom: 0;
  border-right: none;
}
.lls-menu-warpper:not(.is-collapse) {
  width: 208px;
}
::v-deep .lls-menu__collapse-btn {
  border-top: 1px solid rgba(255, 255, 255, .6)!important;
  i {
    color: #bbb;
  }
}
.svg-icon.menu-icon {
  margin-right: 11px;
  font-size: 16px;
  vertical-align: middle;
}
</style>
