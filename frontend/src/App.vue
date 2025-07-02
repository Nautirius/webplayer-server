<template>
  <div id="app">
    <div id="main">
      <div id="covers">
        <div id="playlist" @click="openPlaylistView">
          <img :src="playlistCover" alt="okładka playlisty" />
        </div>
        <cover
          v-for="cover in covers"
          :key="cover.file"
          :prop-a="cover"
        ></cover>
      </div>
      <div id="items" v-if="!playlistView">
        <div id="labels">
          <div style="width: 2vw"></div>
          <div style="width: 2vw"></div>
          <div class="label-1">Tytuł</div>
          <div class="label-2">Album</div>
          <div class="label-3">Rozmiar</div>
        </div>
        <item
          v-for="(item, i) in items"
          :key="i"
          :prop-a="item"
          :id="item.file"
        ></item>
      </div>
      <div id="items" v-else>
        <div id="labels">
          playlista
          <div style="width: 2vw"></div>
          <div style="width: 2vw"></div>
          <div class="label-1">Tytuł</div>
          <div class="label-2">Album</div>
          <div class="label-3">Rozmiar</div>
        </div>
        <playlist-item
          v-for="(item, i) in items"
          :key="i"
          :prop-a="item"
        ></playlist-item>
      </div>
    </div>
    <audio id="audio" style="display: none" @ended="next" controls>
      <source :src="song" id="audio_src" type="audio/mp3" />
    </audio>
    <div id="control-panel">
      <div id="current-cover">
        <img
          :src="this.$store.state.currentCover"
          :alt="this.$store.currentCover"
        />
        <div>{{ this.$store.state.song }}</div>
      </div>
      <div id="custom-controls">
        <div id="buttons">
          <div
            id="previous-button"
            v-if="previousAviable"
            style="background: url(http://localhost:3000/gfx/previous.png)"
            @click="previous"
          ></div>
          <div
            id="previous-button"
            v-else
            style="background: url(http://localhost:3000/gfx/previous_no.png)"
          ></div>
          <div
            id="play-button"
            v-if="!musicPlaying && this.$store.state.song == 'Wybierz utwór'"
            style="background: url(http://localhost:3000/gfx/play_no.png)"
          ></div>
          <div
            id="play-button"
            v-else-if="
              !musicPlaying && this.$store.state.song != 'Wybierz utwór'
            "
            style="background: url(http://localhost:3000/gfx/play.png)"
            @click="play"
          ></div>
          <div
            id="pause-button"
            v-else
            style="background: url(http://localhost:3000/gfx/pause.png)"
            @click="pause"
          ></div>
          <div
            id="next-button"
            v-if="nextAviable"
            style="background: url(http://localhost:3000/gfx/next.png)"
            @click="next"
          ></div>
          <div
            id="next-button"
            v-else
            style="background: url(http://localhost:3000/gfx/next_no.png)"
          ></div>
        </div>
        <p>{{ songTimer }}</p>
        <div id="progress-bar" @click="changeTime">
          <div id="current-time"></div>
        </div>
      </div>
      <div id="volumeControlerWrapper">
        <input
          type="range"
          name="volume"
          id="volumeControler"
          min="0"
          max="1"
          step="0.01"
          value="0.7"
          @input="setVolume"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Cover from "./components/Cover.vue";
import Item from "./components/Item.vue";
import PlaylistItem from "./components/PlaylistItem.vue";
import PlaylistCover from "./assets/playlistCover.jpg";
import axios from "axios";

export default {
  name: "App",
  components: { Item, PlaylistItem, Cover },
  computed: {
    covers() {
      return this.$store.state.covers;
    },
    playlistCover() {
      return PlaylistCover;
    },
    playlistView() {
      return this.$store.state.playlistView;
    },
    items() {
      return this.$store.state.items.files;
    },
    song() {
      return "http://localhost:3000/" + this.$store.state.song;
    },
    songTimer() {
      return (
        String((this.$store.state.songCurrentTime % 3600) / 60).split(".")[0] +
        ":" +
        String(this.$store.state.songCurrentTime % 60).split(".")[0] +
        "/" +
        String((this.$store.state.songDuration % 3600) / 60).split(".")[0] +
        ":" +
        String(this.$store.state.songDuration % 60).split(".")[0]
      );
    },
    musicPlaying() {
      return this.$store.state.musicPlaying;
    },
    currentCover() {
      return this.$store.state.currentCover;
    },
    previousAviable() {
      return (
        this.$store.state.currentlyPlaying != null &&
        this.$store.state.currentlyPlaying > 0
      );
    },
    nextAviable() {
      return (
        this.$store.state.currentlyPlaying != null &&
        this.$store.state.currentlyPlaying < this.items.length - 1
      );
    },
  },
  data() {
    return {
      volume: 0.7,
    };
  },
  mounted() {
    this.$store.dispatch("getStartItemsAction");
    this.$store.dispatch("getCoversAction");
    console.log("comp mounted", new Date().getMilliseconds());
  },
  created() {
    console.log("comp created", new Date().getMilliseconds());
  },
  updated() {
    console.log("comp updated", new Date().getMilliseconds());
  },
  destroyed() {
    console.log("comp destroyed", new Date().getMilliseconds());
  },
  methods: {
    play: function () {
      if (this.$store.state.song != "") {
        document.getElementById("audio").play();
        this.$store.commit("SET_MUSIC_PLAYING", true);
      }
    },
    pause: function () {
      document.getElementById("audio").pause();
      this.$store.commit("SET_MUSIC_PLAYING", false);
    },
    previous: function () {
      if (this.$store.state.currentlyPlaying > 0) {
        this.$store.commit(
          "SET_CURRENTLY_PLAYING",
          this.$store.state.currentlyPlaying - 1
        );
        let newSong = this.$store.state.items.files[
          this.$store.state.currentlyPlaying
        ];
        this.$store.commit("SET_SONG", newSong.album + "/" + newSong.file);
        document.getElementById("audio").load();
        this.$store.commit("SET_MUSIC_PLAYING", true);
        // document
        //   .getElementsByClassName("currentlyPlaying")[0]
        //   .classList.remove("currentlyPlaying");
        // this.$store.state.playlistView
        //   ? document
        //       .getElementById(newSong.id)
        //       .classList.add("currentlyPlaying")
        //   : document
        //       .getElementById(newSong.file)
        //       .classList.add("currentlyPlaying");
      }
    },
    next: function () {
      if (this.$store.state.currentlyPlaying < this.items.length - 1) {
        this.$store.commit(
          "SET_CURRENTLY_PLAYING",
          this.$store.state.currentlyPlaying + 1
        );
        let newSong = this.$store.state.items.files[
          this.$store.state.currentlyPlaying
        ];
        this.$store.commit("SET_SONG", newSong.album + "/" + newSong.file);
        document.getElementById("audio").load();
        this.$store.commit("SET_MUSIC_PLAYING", true);
        // document
        //   .getElementsByClassName("currentlyPlaying")[0]
        //   .classList.remove("currentlyPlaying");
        // this.$store.state.playlistView
        //   ? document
        //       .getElementById(newSong.id)
        //       .classList.add("currentlyPlaying")
        //   : document
        //       .getElementById(newSong.file)
        //       .classList.add("currentlyPlaying");
      } else {
        this.pause();
      }
    },
    changeTime: function (e) {
      if (this.$store.state.song != "Wybierz utwór") {
        document.getElementById("audio").currentTime =
          ((e.clientX - document.getElementById("progress-bar").offsetLeft) /
            parseInt(document.getElementById("progress-bar").offsetWidth)) *
          parseInt(this.$store.state.songDuration);
      }
    },
    setVolume: function (e) {
      document.getElementById("audio").volume = e.target.value;
    },
    openPlaylistView: function () {
      this.$store.commit("SET_PLAYLIST_VIEW", true);
      axios.get("http://localhost:3000/getPlaylist").then((response) => {
        this.$store.commit("SET_ITEMS", response.data);
      });
    },
  },
};
</script>

<style>
#main {
  display: flex;
}
#covers {
  display: flex;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
}
#playlist {
  width: 10vw;
  height: 10vw;
}
#playlist img {
  width: 10vw;
  height: 10vw;
}
#items {
  width: 89.2%;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
#labels {
  display: flex;
  width: 89.2%;
  padding: 10px;
  font-size: 28px;
  font-family: monospace;
  color: white;
}
#labels div {
  float: left;
}
.label-1 {
  width: 50vw;
}
.label-2 {
  width: 46vw;
}
.label-3 {
  width: 1vw;
}
.currentlyPlaying {
  color: blue;
}
#control-panel {
  display: flex;
  justify-content: space-between;
  height: 20vh;
  background: rgb(32, 30, 30);
}
#current-cover {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  font-size: 0.8vw;
  width: 40vh;
}
#current-cover img {
  width: 20vh;
  height: 20vh;
  float: left;
}
#current-cover div {
  margin-left: 10px;
}
#custom-controls {
  display: flex;
  float: left;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 40%;
  height: 20vh;
}
#buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#buttons div {
  width: 5vw;
  height: 5vw;
  background-size: contain !important;
  background-repeat: no-repeat;
}
#buttons div:nth-child(odd) {
  width: 3vw;
  height: 3vw;
}
#progress-bar {
  background: gray;
  width: 100%;
  height: 10px;
}
#current-time {
  background: blue;
  height: 10px;
  width: 0%;
}
#progress-bar p {
  float: left;
}
#volumeControlerWrapper {
  display: flex;
  float: right;
  justify-content: space-evenly;
  align-items: center;
  width: 20vw;
  height: 20vh;
}
#volumeControler {
  width: 150px;
}
body {
  margin: 0;
  background: rgb(37, 35, 35);
  color: white;
  font-family: monospace;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style> 
