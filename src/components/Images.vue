<template>
  <div class="images">
    <div class="imageItem">
      <img :src="items[index]">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Images',
  props: {
    items: Array
  },
  data() {
    return {
      index: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.index++
      if (this.index >= this.items.length) {
        this.index = 0
      }
    }, 1000)
  }
}
</script>

<style scoped lang="stylus">
.images
  .imageItem
    img
      position fixed
      width 100%
      height 100%
      object-fit cover
</style>
