import Vue from 'vue'
import Vuex from 'vuex'
import desks from './modules/desks'
import user from './modules/user'
import alert from './modules/alert'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        desks,
        user,
        alert
    }
})

