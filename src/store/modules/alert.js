import axios from "axios/index";

export default {
    state: {
        snackbar: {
            'open': false,
            'color': 'success',
            'text': ''
        }
    },
    mutations: {
        setAlert(state, alert) {
            state.snackbar.open = alert.open
            state.snackbar.color = alert.color
            state.snackbar.text = alert.text
        }
    },
    actions: {
        setAlert({commit}, alert) {
            commit('setAlert', alert)
        },
        //${user.birth_date.split('-')[1]}/${user.birth_date.split('-')[2]}
        //http://numbersapi.com/${date[1]}/${date[2]}/date
        apiCall({commit}, date) {
            axios.get(`http://numbersapi.com/${date[1]}/${date[2]}/date`)
                .then(r => {
                    commit('setAlert', {
                        'open': true,
                        'color': 'success',
                        'text': r
                    }, {root: true})
                    console.log(date)
                }).catch(err => {
                commit('setAlert', {
                    'open': true,
                    'color': 'error',
                    'text': `Can't get data from Numbersapi.com: ${err.message}`
                }, {root: true})
            })
        }
    },
    getters: {
        snackbar: state => state.snackbar
    }
}