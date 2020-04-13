import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./components/Home.vue'),
            meta: {
                title: 'Главная'
            }
        },
        {
            path: '/add',
            name: 'add',
            component: () => import('./components/AddDesk.vue'),
            meta: {
                title: 'Добавить доску'
            }
        },
        {
            path: '/desks/:id',
            name: 'desk',
            component: () => import('./components/EditDesk.vue'),
            meta: {
                title: 'Редактирование доски'
            }
        }
    ]
})