export default {
    state: {
        user: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
    },
    mutations: {
        createUser(state, user) {
            state.user = {
                'name': user.name,
                'job': user.job,
                'birth_date': user.birth_date
            }
            localStorage.setItem('user', JSON.stringify(state.user))

        }
    },
    actions: {
        createUser({commit}, user) {
            commit('createUser', user)
        }
    },
    getters: {
        user: state => state.user
    }
}