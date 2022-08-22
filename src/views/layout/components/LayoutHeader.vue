<template>
  <header :class="headerFixed && 'fixed'">
    <div class="name">
      <svg-icon icon-class="logo"></svg-icon>
      <span class="text">联易融资产管理系统</span>
    </div>
    <div class="account">
      <lls-avatar size="small" :src="require('@/assets/images/header/avatar.svg')"></lls-avatar>
      <lls-dropdown>
        <span class="lls-dropdown-link">
          用户名<i class="lls-icon-arrow-down lls-icon--right"></i>
        </span>
        <lls-dropdown-menu slot="dropdown">
          <lls-dropdown-item icon="lls-icon-date" @click.native="logout">退出登录</lls-dropdown-item>
        </lls-dropdown-menu>
      </lls-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      headerFixed: false
    }
  },

  methods: {
    handleScroll (e) {
      const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      this.headerFixed = scrollTop > 10
    },
    logout () {
      this.$router.push('/login')
    }
  },

  mounted () {
    document.addEventListener('scroll', this.handleScroll)
  },

  beforeDestory () {
    document.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="stylus" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
  margin-bottom: 10px;
  z-index: 10;
  &.fixed {
    background-color: #F0F2F7;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
    line-height: 52px;
    color: #0887FF;
    svg {
      margin-right: 5px;
    }
  }
  .account {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #4E6275;
    .lls-avatar {
      margin-right: 10px;
      box-shadow: 0 4px 8px 0 rgba(39, 91, 138, .16);
      background: transparent;
    }
    .lls-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
