import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store/store'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
