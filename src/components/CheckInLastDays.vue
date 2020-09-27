<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="500px">
        <v-card-title>Мои последние посещения</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="mark in marks" :key="mark.id">
                <td>{{ new Date(mark.date).toLocaleDateString() }}</td>
                <td>{{ mark.time }}</td>
                <td>
                  <v-icon style="cursor: pointer" @click="deleteDate(mark.id)">
                    mdi-delete-off</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {};
  },
  computed: {
    marks() {
      return this.$store.getters.marks;
    },
  },
  methods: {
    deleteDate(mark) {
      Vue.$db.collection("marks").doc(mark).delete();
      this.$store.dispatch("LOAD_MARKS");
    },
  },
  created() {
    this.$store.dispatch("LOAD_MARKS");
  },
};
</script>

<style>
</style>