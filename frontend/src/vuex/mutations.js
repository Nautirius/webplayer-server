const mutations = {

    SET_ITEMS(state, items) {
        state.items = items
    },
    SET_COVERS(state, covers) {
        state.covers = covers
    },
    SET_SONG(state, song) {
        state.song = song
    },
    SET_CURRENTLY_PLAYING(state, currentlyPlaying) {
        state.currentlyPlaying = currentlyPlaying
    },
    SET_CURRENT_COVER(state, currentCover) {
        state.currentCover = currentCover
    },
    SET_MUSIC_PLAYING(state, musicPlaying) {
        state.musicPlaying = musicPlaying
    },
    SET_SONG_DURATION(state, songDuration) {
        state.songDuration = songDuration
    },
    SET_SONG_CURRENT_TIME(state, songCurrentTime) {
        state.songCurrentTime = songCurrentTime
    },
    SET_PLAYLIST_VIEW(state, playlistView) {
        state.playlistView = playlistView
    },
    APPEND_TO_PLAYLIST(state, song) {
        state.playlist.push(song);
    },
    REMOVE_FROM_PLAYLIST(state, song) {
        state.playlist.filter(item => item == song)
    },
    // kolejne mutations

}

export default mutations