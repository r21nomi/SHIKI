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
        // "image/img_1.jpg",
        // "image/img_2.jpg",
        // "image/img_3.jpg",
        // "image/img_4.jpg",
        // "image/img_5.jpg",
        // "image/img_6.jpg",
        // "image/img_7.jpg",
        // "image/img_8.jpg",
        // "image/img_9.jpg",
        // "image/img_10.jpg"

        // "https://image.rakuten.co.jp/kabegamiharuko/cabinet/prod_img/pc/ss16656_02.jpg",
        // "https://storage.tenki.jp/storage/static-images/suppl/article/image/2/28/281/28114/1/large.jpg",
        // "https://panasonic.jp/life/air/170044/img/main_sp.jpg",
        // "https://images-na.ssl-images-amazon.com/images/I/51dElM+s1qL._SX335_BO1,204,203,200_.jpg",
        // "https://media-01.creema.net/user/178849/exhibits/2955370/1_18c26a010f8af7421f88feb35f0b7418_500.jpg",
        // "https://images-na.ssl-images-amazon.com/images/I/41957T4S8ZL._SX331_BO1,204,203,200_.jpg",
        // "https://www.ehonnavi.net/img/cover/500/500_Ehon_81725.jpg",
        // "https://thumb.photo-ac.com/25/254267b4eba0281ffa5585b011a3b1b4_t.jpeg",
        // "https://media-01.creema.net/user/461409/exhibits/8181395/0_4d97f70fc23275b9ca6ac2d0befb6609_500.jpg",
        // "https://www.cinra.net/uploads/img/news/2020/20200902-soranisumu_full.jpg"
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
    // if (!this.useStaticImages) {
      this.startFetchItems()
    // }
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
