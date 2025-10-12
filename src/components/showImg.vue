<template>
  <el-image-viewer
    :urlList="urlList"
    :on-close="handleClose"
  ></el-image-viewer>
</template>

<script>
import ImageViewer from '@/components/imageViewer.vue'
export default {
  name: 'ShowImg',
  props: {
    urlList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    [ImageViewer.name]: ImageViewer
  },
  data() {
    return {}
  },
  mounted() {
    this.postFixedMessage(true)
  },
  methods: {
    handleClose() {
      this.$emit('close')
      this.postFixedMessage(false)
    },
    postFixedMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: 'messageGeneralProduct',
          fixed: fixed
        },
        '*'
      )
    }
  }
}
</script>

<style lang="stylus" scoped></style>
