<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    :width="documentWidth * 2"
    :height="documentHeight"
    class="svg-mask"
  >
    <path
      :d="`M${pathValue.pathStartX} ${pathValue.pathStartY} h${
        documentWidth - pathValue.pathStartX + 8
      } v${pathValue.pathEndY - pathValue.pathStartY} L${pathValue.pathEndX} ${
        pathValue.pathEndY
      }`"
      stroke-width="1"
      stroke="#0887FF"
      stroke-dasharray="5 5"
      fill="transparent"
    />
    <circle
      v-if="pathValue.pathStartX != documentWidth"
      :cx="pathValue.pathStartX"
      :cy="pathValue.pathStartY"
      r="3"
      fill="#0887FF"
    />
    <circle
      :cx="pathValue.pathEndX"
      :cy="pathValue.pathEndY"
      r="2"
      fill="#0887FF"
    />
  </svg>
</template>

<script>
export default {
  name: 'svgPath',
  props: {
    documentWidth: {
      type: Number,
      default: function() {
        return null
      }
    },
    documentHeight: {
      type: Number,
      default: function() {
        return null
      }
    },
    pathValue: {
      type: Object,
      default: function() {
        return null
      }
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
