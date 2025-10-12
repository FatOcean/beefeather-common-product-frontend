<template>
  <svg viewBox="0 0 32 32">
    <circle
      r="16"
      cx="16"
      cy="16"
      fill="rgba(32, 45, 64, 0.1)"
      stroke="rgba(247, 248, 250, 0.7)"
      stroke-width="32"
      :stroke-dasharray="`${percent} 100`"
    />
    <circle
      r="16"
      cx="16"
      cy="16"
      fill="none"
      stroke="rgba(247, 248, 250, 0.7)"
      stroke-width="8"
      :stroke-dasharray="`${100 - percent} 100`"
      :style="{
        transform: `rotate(${(-360 * (100 - percent)) / 100}deg)`,
        'transform-origin': 'center',
      }"
    />
  </svg>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number | String,
      default: 0,
    },
  },
};
</script>
<style scoped>
svg {
  transform: rotate(-90deg);
  /* background: rgba(32, 45, 64, 0.6);  */
  width: 28px;
  height: 28px;
  /* border: 4px solid rgba(247, 248, 250, 0.7); */
  border-radius: 50%;
}

circle {
  /* stroke-dasharray: 38 100;  */
}
</style>