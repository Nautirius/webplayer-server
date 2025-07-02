import axios from 'axios'

const actions = {
    getStartItemsAction({ commit }) {
        axios.post('http://localhost:3000/startitems')
            .then(response => {
                commit('SET_ITEMS', response.data)
            })
    },
    getCoversAction({ commit }) {
        axios.post('http://localhost:3000/cover')
            .then(response => {
                commit('SET_COVERS', response.data)
            })
    },
    // kolejne akcje, jeśli potrzebne
}

export default actions