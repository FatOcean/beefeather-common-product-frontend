<template>
  <div id="app">
    <!-- <c-background></c-background> -->
    <router-view></router-view>
  </div>
</template>

<script>
import CBackground from '@/components/c-background'

export default {
  name: 'app',
  components: { CBackground }
}
</script>
