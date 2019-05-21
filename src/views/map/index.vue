<style lang="sass">
.maps
  &__container
    +size(100vw, 100vh)
    position: relative
    // overflow-y: scroll

#maps
  +size(100%)
  &-details
    &__container
      +size(rem(320px), rem(280px))
      position: fixed
      top: rem(100px)
      left: rem(20px)
      box-shadow: 0 2px 4px 0 rgba(50,50,55,.15)

.detail
  &__container
    +size(100%)
    +flex(flex-start, center, column)
    padding: rem(12px 8px)
    letter-spacing: 1px
  &__title
    flex: 2
    +flex(flex-start, center, column)
    font-size: rem(20px)
    font-weight: 600
  &__content
    flex: 4
  &__routes
    flex: 2
    width: 100%
    button
      width: 100%
      border: 0
      align-items: center
      background-color: #f1f3f3
      border-radius: 9999px
      color: #0069d2
      display: flex
      font-size: 14px
      font-weight: 600
      justify-content: center
      letter-spacing: 2px
      line-height: 44px
      text-align: center
      text-decoration: none
      transition: all .3s
  &__item
    margin: rem(6px 0)
</style>

<template lang="pug">
  .maps__container
    //- p {{ pos }}
    #maps
    #maps-details__container
      .detail__container
        .detail__title
          p 中油石門加油站
        .detail__content
          .detail__item
            p 地址：新北市石門區中央路1之15號(近石門國中)
          .detail__item
            p 地址：新北市石門區中央路1之15號(近石門國中)
        .detail__routes
          button 前往
    //- .results__container(
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
import pin from '@/assets/images/common/pin.svg'
import station from '@/assets/images/common/station.png'

let map
let infoWindow

export default {
  data() {
    return {
      pos: null,
      results: null,
      pin,
      station,
    }
  },
  mounted() {
    // this.getStations()
    // if (navigator.geolocation) {
    //   console.log('Geolocation is supported!')
    //   this.getGeolocation()
    // }
    // else {
    //   console.log('Geolocation is not supported for this Browser/OS version yet.')
    // }
    const scriptTag = document.getElementsByTagName('script')
    const key = 'hi'
    const mapSrc = `https://maps.googleapis.com/maps/api/js?key=${key}`
    let hasLoaded = false
    for (let i = 0; i < scriptTag.length; i += 1) {
      if (scriptTag[i].src === mapSrc) {
        hasLoaded = true
      }
    }
    if (!hasLoaded) {
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.type = 'text/javascript'
      script.src = mapSrc
      document.body.appendChild(script)
      script.onload = script.onreadystatechange = () => {
        console.log('done')
        // this.getGeolocation()
        // this.initMap()
      }
      // script.onerror = (err) => {
      //   // reject(err)
      //   console.log('error', err)
      // }
    }
    // this.getGeolocation()
    // this.initMap()
    // this.getStations()
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
          let stationIcon = {
            url: this.station, // url
            size: new google.maps.Size(25, 25),
          }
          for (let i = 0; i < this.results.length; i++) {
            let latLng = new google.maps.LatLng(this.results[i].lat,this.results[i].lng)
            let contentString = `
              <div id="maps-details__container">
                <div class="detail__container">
                  <div class="detail__title">
                    <p>${this.results[i].name}</p>
                  </div>
                  <div class="detail__content">
                    <div class="detail__item">
                      <p>地址：${this.results[i].address}</p>
                    </div>
                    <div class="detail__item">
                      <p>營業時間：${this.results[i].time}</p>
                    </div>
                  </div>
                </div>
              </div>`
            let infowindow = new google.maps.InfoWindow({
              content: contentString,
            })
            let marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon: stationIcon,
            })
            marker.addListener('click', () => {
              console.log('clickclick', this.results[i])
              // let popup = document.getElementById('popup')
              // console.log(popup)
              this.$nextTick(() => {
                infowindow.open(map, marker)
              })
            })
          }
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getGeolocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        this.pos = {
          lat: latitude,
          lng: longitude,
        }
        infoWindow.setPosition(this.pos)
        map.setCenter(this.pos)
        let icon = {
          url: this.pin, // url
          size: new google.maps.Size(30, 30),
        }
        const marker = new google.maps.Marker({
          position: this.pos,
          map: map,
          // icon,
        })
      })
    },
    initMap() {
      map = new google.maps.Map(document.getElementById('maps'), {
        zoom: 18,
      })
      infoWindow = new google.maps.InfoWindow
      this.getGeolocation()
    },
  },
}
</script>
