<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { login } from '@/api/receiptAnalysis'
export default {
  name: 'app',
  computed: {
    ...mapState(['pageMenuPerm'])
  },
  created() {
    // this.devSSO()
  },

  watch: {
    $route(val) {
      this.messageIframeProduct()
    }
  },
  mounted() {
    // 接收iframe的数据
    window.addEventListener('message', this.messageIframeProduct)
  },
  methods: {
    devSSO() {
      // 判断是不是本地开发环境
      if (window.location.host.indexOf('localhost') === -1) return
      const loginData =
      {
        password: 'oJCRxvvpFjA2YDiNyEYP8OH4VCib8Txlw/NY6bSMbN7UmetVhjO3EsSZqXP8UH9DV9zgCCY2vRny79F1UVqGm3NPQHfOhQ9FOsDQvk3k186i3kLvaSJ5GnmAovTJbsw023xUaIy0AgbnDeuZWkI/riGjixLibpjMDVoPHJy2IZANmxCNdsbUTv44DRlxWvNyPqQOEsqZX2UtUNWWIXpU9k5aBLJVP96bSZt/56Ry+yWJ76suddQ/coEoYehT8Ak/x68nhcFy4cEYzDB3tJ6DkjkhShoJz4UCUybSyPZ6dY5L09oNxKdEH8IpkRjL7mVT8xHurYFb97/lBzzaTnWhSg==',
        picCheckCode: 'a',
        userName: 'admin'
      }
      login(loginData).then(res => {
        console.log('登录成功')
      })
    },

    ...mapMutations(['changePageMenuPerm', 'setProductData']),
    messageIframeProduct(e) {
      if (e?.data) {
        this.setProductData(e.data)
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.messageIframeProduct)
  }
}
</script>
