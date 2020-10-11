<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="500px">
        <v-card-title>Мои последние посещения</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="checkin in massCheckins" :key="checkin.id">
                <td>{{ checkin.date  | moment("DD.MM.YY ddd") }}</td>
                <td>{{ checkin.time }}</td>
                <td>
                  <v-icon style="cursor: pointer" @click="deleteDate(checkin.id)">
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
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getProcessing']),
    massCheckins() {
      return this.$store.getters.userMassCheckins;
    },
  },
  methods: {
    deleteDate(checkin) {
      Vue.$db.collection("massCheckins").doc(checkin).delete();
      this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER");
    },
  },
  created() {
    this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER");
  },
};
</script>

<style>
</style>