import axios from 'axios'

const plugin = {
  install(Vue) {
    const $vm = Vue
    $vm.prototype.$axios = axios
    console.log('in axios plugin', process.env.VUE_APP_API_URL)
    axios.defaults.baseURL = process.env.VUE_APP_API_URL
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.timeout = 5000

    axios.interceptors.request.use(config => config, error => Promise.reject(error))
    axios.interceptors.response.use(response => response, error => Promise.reject(error))
  },
}

export default plugin
