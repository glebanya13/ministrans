<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap align-center justify-center class="hidden-sm-and-down">
      <v-flex xs12>
        <h1 class="text-center">График министрантов</h1>
      </v-flex>
      <v-flex xs12 md6 xl4>
        <v-card width="490" outlined class="elevation-0 transparent">
          <bar-chart
            xtitle="Посещения Имш"
            ytitle="Министранты"
            :data="churchData"
            width="490px"
            height="650px"
            :stacked="true"
          ></bar-chart>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 xl4>
        <v-card width="490" outlined class="elevation-0 transparent">
          <bar-chart
            :data="meetingData"
            width="490px"
            height="650px"
            xtitle="Посещения Встреч"
          ></bar-chart>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap  align-center justify-center class="hidden-md-and-up">
      <v-flex>
        <h1 class="text-center ml-4">График министрантов</h1>
      </v-flex>
      <v-flex>
        <v-card width="372" outlined class="elevation-0 transparent ml-2">
          <bar-chart
            xtitle="Посещения Имш"
            ytitle="Министранты"
            :data="churchData"
            width="372px"
            height="812px"
            :stacked="true"
          ></bar-chart>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card width="372" outlined class="elevation-0 transparent">
          <bar-chart
            :data="meetingData"
            width="372px"
            height="812px"
            xtitle="Посещения Встреч"
            ytitle="Министранты"
          ></bar-chart>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["stats", "meetingStats"]),

    churchData() {
      let resWeekDay = {};
      let resSunday = {};
      for (var k in this.stats) {
        resSunday[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => x.isSunday).length;
        resWeekDay[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => !x.isSunday).length;
      }

      return [
        {
          name: "Будние",
          data: resWeekDay,
        },
        {
          name: "ВС",
          data: resSunday,
        },
      ];
    },
    meetingData() {
      let resMeets = {};
      for (var key in this.meetingStats) {
        resMeets[
          `${this.meetingStats[key][0].name} ${this.meetingStats[key][0].surname}`
        ] = this.meetingStats[key].filter((x) => x.isMeeting).length;
      }
      return [
        {
          name: "Встречи",
          data: resMeets,
          color: "#008000",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["LOAD_STATS"]),
  },
  created() {
    this.LOAD_STATS();
  },
};
</script>

<style>
</style>