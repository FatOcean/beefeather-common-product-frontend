<template>
  <div class="login">
    <div class="container">
      <img class="login-logo" src="~@/assets/images/login/login_logo.png" alt="logo">
      <lls-login @login="login" :state="state"></lls-login>
    </div>
  </div>
</template>

<script>
import llsLogin from '@linklogis/login'

export default {
  components: {
    llsLogin
  },
  data () {
    return {
      state: ''
    }
  },
  methods: {
    login (value) {
      this.state = 'sendSuc'
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url(/src/assets/images/login/login_bg.png);
  background-size: auto 100%;
  background-position: center;
  box-sizing: border-box;
  padding: 0 15px;
  .container {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    .login-logo {
      position: absolute;
      left: 0;
      top: 15px;
      height: 30px;
    }
  }
}
</style>
