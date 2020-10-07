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
        <div class="text-center">
          <v-progress-circular
            v-if="getProcessing"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getProcessing']),
    marks() {
      return this.$store.getters.userMarks;
    },
  },
  methods: {
    deleteDate(mark) {
      Vue.$db.collection("marks").doc(mark).delete();
      this.$store.dispatch("LOAD_MARKS_BY_USER");
    },
  },
  created() {
    this.$store.dispatch("LOAD_MARKS_BY_USER");
  },
};
</script>

<style>
</style>