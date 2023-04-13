<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "app",
  computed: {
    ...mapState(["pageMenuPerm"]),
  },
  watch: {
    $route(val) {
      this.messageIframeProduct();
    },
  },
  mounted() {
    // 接收iframe的数据
    window.addEventListener("message", this.messageIframeProduct);
  },
  methods: {
    ...mapMutations(["changePageMenuPerm"]),
    messageIframeProduct(e) {
      if (e && e.data && e.data.pageMenuPerm) {
        console.log("zhix");
        const pageMenuPerm = e.data.pageMenuPerm;
        this.$nextTick(() => {
          this.changePageMenuPerm(pageMenuPerm);
        });
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.messageIframeProduct);
  },
};
</script>
