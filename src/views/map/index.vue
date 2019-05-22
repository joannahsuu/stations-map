<style lang="sass">
.maps
  &__container
    +size(100vw, 100vh)

#maps
  +size(100%)
  &-details
    &__container
      +size(rem(320px), rem(200px))
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
    margin: rem(8px 0)
</style>

<template lang="pug">
  .maps__container
    #maps
</template>

<script>
import transformStationsList from './transform'
import pin from '@/assets/images/common/pin.svg'
import station from '@/assets/images/common/station.png'

let map
let infoWindow
// 載入路線服務與路線顯示圖層
let directionsService
let directionsDisplay

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
    this.getStations()
    const scriptTag = document.getElementsByTagName('script')
    const key = 'YOUR_MAP_KEY'
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
      script.onload = () => {
        this.initMap()
      }
    }
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
          const stationIcon = {
            url: this.station, // url
            size: new google.maps.Size(25, 25),
          }
          for (let i = 0; i < this.results.length; i += 1) {
            const latLng = new google.maps.LatLng(
              this.results[i].lat,
              this.results[i].lng
            )
            const contentString = `
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
                  <div class="detail__routes">
                    <button id="routes__btn">前往</button>
                  </div>
                </div>
              </div>`
            const infowindow = new google.maps.InfoWindow({
              content: contentString,
            })
            const marker = new google.maps.Marker({
              position: latLng,
              map,
              icon: stationIcon,
            })
            marker.addListener('click', () => {
              // console.log('clickclick', this.results[i])
              // let popup = document.getElementById('popup')
              // console.log(popup)
              infowindow.open(map, marker)
              this.$nextTick(() => {
                const btn = document.getElementById('routes__btn')
                // console.log('btn', btn)
                btn.addEventListener('click', () => {
                  // 先關閉 infowindow，再導航
                  infowindow.close()
                  this.routing(this.results[i])
                })
              })
            })
          }
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    routing(item) {
      const { lat, lng } = item
      // 放置路線圖層
      directionsDisplay.setMap(map)
      // 路線相關設定
      const request = {
        origin: { ...this.pos },
        destination: { lat, lng },
        travelMode: 'DRIVING',
      }

      // 繪製路線
      directionsService.route(request, (result, status) => {
        // console.log(result)
        // console.log(status)
        if (status === 'OK') {
          // 回傳路線上每個步驟的細節
          // console.log(result.routes[0].legs[0].steps)
          directionsDisplay.setDirections(result)
        } else {
          console.log(status)
        }
      })
    },
    getGeolocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        this.pos = {
          lat: latitude,
          lng: longitude,
        }
        infoWindow.setPosition(this.pos)
        map.setCenter(this.pos)
        const icon = {
          url: this.pin, // url
          size: new google.maps.Size(30, 30),
        }
        const marker = new google.maps.Marker({
          position: this.pos,
          map,
          // icon,
        })
      })
    },
    initMap() {
      // 載入路線服務與路線顯示圖層
      directionsService = new google.maps.DirectionsService()
      directionsDisplay = new google.maps.DirectionsRenderer()

      map = new google.maps.Map(document.getElementById('maps'), {
        zoom: 16,
      })
      infoWindow = new google.maps.InfoWindow
      this.getGeolocation()
    },
  },
}
</script>
