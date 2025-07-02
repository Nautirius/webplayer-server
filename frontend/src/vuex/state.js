import defaultCover from "../assets/defaultCover.png"
const state = {
    covers: [],
    items: [],
    song: "Wybierz utwór",
    musicPlaying: false,
    currentlyPlaying: null,
    songDuration: null,
    songCurrentTime: null,
    currentCover: defaultCover,
    playlistView: false,
    playlist: []
}

export default state