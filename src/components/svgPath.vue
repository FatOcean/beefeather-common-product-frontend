<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    :width="documentWidth * 2"
    :height="documentHeight"
    class="svg-mask"
    v-if="pathValue"
  >
    <path
      :d="`M${pathValue.pathStartX} ${pathValue.pathStartY} h${
        documentWidth - pathValue.pathStartX + 8
      } v${pathValue.pathEndY - pathValue.pathStartY} L${pathValue.pathEndX} ${
        pathValue.pathEndY
      }`"
      stroke-width="1"
      stroke="#009688"
      stroke-dasharray="5 5"
      fill="transparent"
    />
    <circle
      v-if="pathValue.pathStartX != documentWidth"
      :cx="pathValue.pathStartX"
      :cy="pathValue.pathStartY"
      r="3"
      fill="#009688"
    />
    <circle
      :cx="pathValue.pathEndX"
      :cy="pathValue.pathEndY"
      r="2"
      fill="#009688"
    />
  </svg>
</template>

<script>
export default {
  name: 'Svgpath',
  props: {
    pathValue: {
      type: Object,
      default: null
    },
    documentWidth: {
      type: Number,
      default: 0
    },
    documentHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="stylus" scoped></style>
