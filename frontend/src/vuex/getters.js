const getters = {
    getItems: function (state) {
        return state.items
    },
    getCovers: function (state) {
        return state.covers
    },
    getSong: function (state) {
        return state.song
    },
    getMusicPlaying: function (state) {
        return state.musicPlaying
    },
    // kolejne gettery...

}

export default getters