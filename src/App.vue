<template>
  <div id="app">
    <div class="imageContainer">
      <Images :items="items" />
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Images from "@/components/Images";

const REQUEST_COUNT = 3

export default {
  name: 'App',
  components: {Images},
  data() {
    return {
      items: [],
      fetchCount: 0
    }
  },
  async mounted() {
    this.startFetchItems()
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
      const query = "bluesky"
      const count = 10  // maximum number is 10.
      const start = this.items.length > 0 ? this.items.length + 1 : 0
      const color = "blue"

      const response = await axios.get(
        `${process.env.VUE_APP_API_ENDPOINT}?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image&num=${count}&imgDominantColor=${color}&imgSize=LARGE&imgColorType=color&start=${start}`
      )
      const _items = response.data.items.map(item => {
        return item.link
      })

      this.items.push(..._items)
      this.fetchCount++
    }
  }

}
</script>

<style lang="stylus">
@require "~@/assets/style/common"
</style>
