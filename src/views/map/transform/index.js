/**
 * 處理換電點名稱
 * @param {*} value
 */
function handleName(value) {
  const name = JSON.parse(value)
  return name.List[1].Value
}

/**
 * 處理換電點名稱
 * @param {*} value
 */
function handleAddress(value) {
  const address = JSON.parse(value)
  return address.List[1].Value
}

export default function transformStationsList(list) {
  // console.log('======transformStationsList======', list)
  return list.map(item => ({
    name: handleName(item.LocName),
    address: handleAddress(item.Address),
    lat: item.Latitude,
    lng: item.Longitude,
    time: item.AvailableTime,
    zipcode: item.ZipCode,
  }))
}
