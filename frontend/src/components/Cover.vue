<template>
  <div class="cover">
    <img
      :src="'http://localhost:3000/' + albumName + '/' + albumImage"
      :alt="albumName"
      @click="showInfo(), changeOpt()"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    propA: { type: Object, required: true },
  },
  data: function () {
    return {
      albumName: this.propA.file,
      albumImage: this.propA.image,
    };
  },
  methods: {
    showInfo: function () {
      //   alert(JSON.stringify(this.album, null, 4));
    },
    changeOpt: function () {
      axios
        .post("http://localhost:3000/items/" + this.propA.file)
        .then((response) => {
          this.$store.commit("SET_PLAYLIST_VIEW", false);
          this.$store.commit("SET_ITEMS", response.data);
        });
    },
  },
};
</script>
<style scoped>
img {
  width: 10vw;
  height: 10vw;
}
</style>