<template lang="pug">
  .maps__container
    p {{ pos }}
    //- #maps
    .results__container(
      v-if="results"
      v-for="(result, idx) in results"
      :key="idx")
      .detail__title
        p {{ result.LocName }}
      .detail__content
        .detail__item
          p 緯度：{{ result.lat }}
          p 經度：{{ result.lng }}
          p zipcode：{{ result.zipcode }}
          p 地址：{{ result.address }}
          p 服務時間：{{ result.time }}
</template>

<script>
import transformStationsList from './transform'

export default {
  data() {
    return {
      pos: null,
      results: null,
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(() => {
  //     const scriptTag = document.getElementsByTagName('script')
  //     let hasLoaded = false
  //     for (let i = 0; i < scriptTag.length; i += 1) {
  //       if (scriptTag[i].src === mapSrc) {
  //         hasLoaded = true
  //       }
  //     }
  //     if (!hasLoaded) {
  //       const script = document.createElement('script')
  //       script.type = 'text/javascript'
  //       script.src = mapSrc
  //       document.body.appendChild(script)
  //       // script.onload = script.onreadystatechange = () => {
  //       //   // resolve('done')
  //       //   console.log('done')
  //       // }
  //       // script.onerror = (err) => {
  //       //   // reject(err)
  //       //   console.log('error', err)
  //       // }
  //     }
  //   })
  // },
  mounted() {
    // if (navigator.geolocation) {
    //   console.log('Geolocation is supported!')
    //   this.getGeolocation()
    // }
    // else {
    //   console.log('Geolocation is not supported for this Browser/OS version yet.')
    // }
    // this.initMap()
    this.getStations()
  },
  methods: {
    getStations() {
      this.$axios({
        method: 'get',
        url: 'https://wapi.gogoro.com/tw/api/vm/list',
      }).then((resp) => {
        const respData = resp.data
        console.log('====================================')
        console.log('api response:', respData)
        console.log('====================================')
        if (respData.data) {
          const { data } = respData
          const result = transformStationsList(data)
          // console.log('result', result)
          this.results = result
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getGeolocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        console.log(position.coords.latitude, position.coords.longitude)
        const {latitude, longitude} = position.coords
        this.pos = {
          lat: latitude,
          lng: longitude,
        }
      })
    },
    initMap() {
      let map
      map = new google.maps.Map(document.getElementById('maps'), {
        center: { lat: -25.363, lng: 131.044 },
        zoom: 5,
      })
    },
  },
}
</script>

<style lang="sass">
.maps
  &__container
    +size(100%, 100%)
    overflow-y: scroll

#maps
  +size(400px)
</style>
