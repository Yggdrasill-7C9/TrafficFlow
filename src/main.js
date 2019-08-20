import Vue from 'vue'
import App from './App.vue'
import router from './router'
import WebFont from 'webfontloader'
import './assets/styles/main.css'

import TrafficFlow from './components/TrafficFlow/'
Vue.use(TrafficFlow)

Vue.config.productionTip = false

WebFont.load({
  custom: {
    families: ['Source Sans Pro:n3,n4,n6,n7'],
    urls: ['/fonts/source-sans-pro.css']
  },
  active () {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
