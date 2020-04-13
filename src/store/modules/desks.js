export default {
    state: {
        desks: JSON.parse(localStorage.getItem('desks') || '[]')
    },
    mutations: {
        addDesk(state, desk) {
            desk = {
                'id': desk.id,
                'title': desk.title,
                'columns': desk.columns.filter((item, index) => desk.columns.indexOf(item) == index).map((item, index) => {
                    return {
                        'title': item,
                        'id': index + 1,
                        'tasks': []
                    }
                }),
                'finished_tasks': []
            }
            state.desks.unshift(desk)
            localStorage.setItem('desks', JSON.stringify(state.desks))
        },
        updateDesk(state, desk) {
            const idx = state.desks.findIndex(d => d.id == desk.id)
            state.desks[idx] = desk
            localStorage.setItem('desks', JSON.stringify(state.desks))
        }
    },
    actions: {
        addDesk({commit}, desk) {
            commit('addDesk', desk)
        },
        updateDesk({commit}, desk) {
            commit('updateDesk', desk)
        }
    },
    getters: {
        getDesks: state => state.desks,
        getDeskById: state => id => state.desks.find(d => d.id == id)
    }
}