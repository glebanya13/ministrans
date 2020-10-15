<template>
  <div>
    <h3>{{ this.users }}</h3>
    <button @click="loadJSON()">Загрузка на сервер</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(["LOAD_MARKS_DATA", "LOAD_USERS_DATA", "BATCH"]),
    loadJSON() {
      // this.LOAD_USERS_DATA()
      // this.LOAD_MARKS_DATA()
      this.$store.dispatch("BATCH");

    },
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    filejson() {
      var x = JSON.stringify(this.users);
      return x;
    },
  },
};
</script>

<style>
</style>