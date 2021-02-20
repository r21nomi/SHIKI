<template>
  <div class="images">
    <div class="imageItem" :style="{ backgroundImage: `url(${items[oldIndex]})` }"></div>
    <div ref="foregroundImage" class="imageItem foregroundImage"
         :class="{ anim: isAnimate }"
         :style="{ backgroundImage: `url(${items[index]})` }"></div>
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
      index: 0,
      oldIndex: 0,
      isAnimate: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.isAnimate = true
      this.changeImage()
    }, 1000)

    this.$refs.foregroundImage.addEventListener('transitionend', () => {
      this.oldIndex = this.index
      this.isAnimate = false
      this.changeImage()

      setTimeout(() => {
        this.isAnimate = true
      }, 500)
    });
  },
  methods: {
    changeImage() {
      this.index++
      if (this.index >= this.items.length) {
        this.index = 0
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.images
  .imageItem
    position fixed
    width 100%
    height 100%
    background-size cover
    background-position center
    filter blur(30px)

    &.foregroundImage
      opacity 0

      &.anim
        transition opacity 5.0s linear
        opacity 1

  img
    position fixed
    width 100%
    height 100%
    object-fit contain
</style>
