<template>
  <div
    class="element"
    :id="propA.file"
    @mouseenter="focus(0)"
    @mouseleave="focus(1)"
  >
    <div class="item-0" @click="changeSong"></div>
    <div class="item-0-2" @click="addToPlaylist"></div>
    <div class="item-1" @click="changeSong">{{ propA.file }}</div>
    <div class="item-2" @click="showInfo">{{ propA.album }}</div>
    <div class="item-3">{{ propA.size.substr(0, 4), }}MB</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    propA: { type: Object, required: true },
  },
  computed: {
    data() {
      return {
        album: this.propA.album,
        fileName: this.propA.file,
        fileSize: this.propA.size.substr(0, 4),
        item: this.propA,
      };
    },
  },
  methods: {
    showInfo: function () {
      alert(JSON.stringify(this.propA, null, 4));
    },
    focus: function (mode) {
      let fbk = document.getElementById(this.propA.file).children;
      fbk[0].style.opacity = mode == 0 ? 1 : 0;
      fbk[1].style.opacity = mode == 0 ? 1 : 0;
    },
    changeSong: function () {
      this.$store.commit("SET_SONG", this.propA.album + "/" + this.propA.file);
      this.$store.commit(
        "SET_CURRENTLY_PLAYING",
        this.$store.state.items.files.findIndex(
          (item) => item.file == this.propA.file
        )
      );
      var audio = document.getElementById("audio");
      var currentTime = document.getElementById("current-time");
      audio.load();
      audio.onloadeddata = (e) => {
        this.$store.commit("SET_SONG_DURATION", audio.duration);
        e.target.play();
        e.target.ontimeupdate = (e) => {
          this.$store.commit("SET_SONG_CURRENT_TIME", audio.currentTime);
          currentTime.style.width =
            (e.target.currentTime / audio.duration) * 100 + "%";
        };
      };
      console.log(this.propA.album);
      console.log(this.$store.state.covers[0].file);

      let currentCover = this.$store.state.covers.find(
        (cover) => cover.file == this.propA.album
      );

      this.$store.commit(
        "SET_CURRENT_COVER",
        "http://localhost:3000/" + currentCover.file + "/" + currentCover.image
      );
      this.$store.commit("SET_MUSIC_PLAYING", true);

      // document.getElementsByClassName("currentlyPlaying").forEach((el) => {
      //   el.classList.remove("currentlyPlaying");
      // });
      // document
      //   .getElementById(this.propA.file)
      //   .classList.add("currentlyPlaying");
    },
    addToPlaylist: async function () {
      try {
        axios.post(
          "http://localhost:3000/playlist/addItem/" + JSON.stringify(this.propA)
        );
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.element {
  display: flex;
  font-family: monospace;
  font-size: 1.2vw;
  padding-bottom: 10px;
  cursor: default;
}
.element div {
  float: left;
  height: 1.5vw;
}
.item-0 {
  width: 2vw;
  background: url("http://localhost:3000/gfx/play.png");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
}
.item-0-2 {
  width: 2vw;
  background: url("http://localhost:3000/gfx/addToPlaylist.png");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
}
.item-1 {
  width: 40vw;
}
.item-2 {
  width: 40vw;
}
.item-3 {
  width: 6vw;
}
.element:hover {
  color: lightblue;
}
.element span:hover {
  cursor: pointer;
}
</style>