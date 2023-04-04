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
  methods: {
    ...mapMutations(["changePageMenuPerm"]),
  },
  mounted() {
    // 接收iframe的数据
    window.addEventListener("message", (e) => {
      if (e && e.data && e.data.pageMenuPerm) {
        const pageMenuPerm = e.data.pageMenuPerm;
        this.$nextTick(() => {
          this.changePageMenuPerm(pageMenuPerm);
        });
      }
    });
  },
};
</script>
