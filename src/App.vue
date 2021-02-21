<template>
  <div id="app" class="app">
    <Images v-if="useStaticImages" :items="items" />
    <GLSLCanvasContainer v-else :images="items" />
  </div>
</template>

<script>
import axios from "axios"
import Images from "@/components/Images"
import GLSLCanvasContainer from "@/components/GLSLCanvasContainer"

const REQUEST_COUNT = 1

export default {
  name: 'App',
  components: {GLSLCanvasContainer, Images},
  data() {
    return {
      useStaticImages: true,
      items: [
        "image/img_1.jpg",
        "image/img_2.jpg",
        "image/img_3.jpg",
        "image/img_4.jpg",
        "image/img_5.jpg",
        "image/img_6.jpg",
        "image/img_7.png",
        "image/img_8.jpg",
        "image/img_9.jpg",
        "image/img_10.jpg"
      ],
      fetchCount: 0,
      searchCondition: {
        blue: {
          query: "calm sky",
          color: "blue",
          lr: "lang_ja"
        },
        yellow: {
          query: "daytime sun",
          color: "orange",
          lr: "lang_ja"
        },
        green: {
          query: "森林",
          color: "green",
          lr: "lang_ja"
        }
      }
    }
  },
  mounted() {
    //   this.startFetchItems()
  },
  methods: {
    async startFetchItems() {
      await this.fetchItems()

      if (this.fetchCount < REQUEST_COUNT) {
        setTimeout(() => this.startFetchItems(), 2000)
      }
    },
    async fetchItems() {
      const apiKey = process.env.VUE_APP_API_API_KEY
      const searchEngineId = process.env.VUE_APP_SEARCH_ENGINE_ID
      const searchCondition = this.searchCondition.blue
      const query = searchCondition.query
      const count = 10  // maximum number is 10.
      const start = this.items.length > 0 ? this.items.length + 1 : 0
      const color = searchCondition.color
      const size = "large"
      const lr = searchCondition.lr

      const response = await axios.get(
        `${process.env.VUE_APP_API_ENDPOINT}?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image&num=${count}&imgDominantColor=${color}&imgSize=${size}&imgColorType=color&start=${start}&lr=${lr}`
      )
      const _items = response.data.items.map(item => {
        return item.link
      })

      this.items.push(..._items)
      this.fetchCount++
    },
  }
}
</script>

<style lang="stylus">
@require "~@/assets/style/common"

.app
  width 100%
  height 100%
  position fixed
</style>
