<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap align-center justify-center class="hidden-sm-and-down">
      <v-flex xs12>
        <h1 class="text-center">График министрантов</h1>
      </v-flex>
      <v-flex xs12 md6 xl4>
        <v-card width="400" outlined class="elevation-0 transparent mx-auto">
          <bar-chart
            xtitle="Посещения Имш"
            ytitle="Министранты"
            :data="churchData"
            width="400px"
            height="600px"
            :stacked="true"
          ></bar-chart>
          <v-slider
            v-model="statsFilterSlider"
            :label="`Посещения за ${statsFilterName}`"
            max="5"
            min="1"
          ></v-slider>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 xl4>
        <v-card width="400" outlined class="elevation-0 transparent">
          <bar-chart
            :data="meetingData"
            width="400px"
            height="600px"
            xtitle="Посещения Встреч"
          ></bar-chart>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center justify-center class="hidden-md-and-up">
      <v-flex>
        <h1 class="text-center ml-4">График министрантов</h1>
      </v-flex>
      <v-flex>
        <v-card width="300" outlined class="elevation-0 transparent ml-2">
          <bar-chart
            xtitle="Посещения Имш"
            ytitle="Министранты"
            :data="churchData"
            width="300px"
            height="600px"
            :stacked="true"
          ></bar-chart>
          <v-slider
            v-model="statsFilterSlider"
            :label="`Посещения за ${statsFilterName}`"
            max="5"
            min="1"
          ></v-slider>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card width="300" outlined class="elevation-0 transparent">
          <bar-chart
            :data="meetingData"
            width="300px"
            height="600px"
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
import moment from "moment";

export default {
  data() {
    return {
      statsFilterSlider: 1,
    };
  },
  computed: {
    ...mapGetters(["stats", "meetingStats"]),
    statsFilterName() {
      let name;
      let statsFilter = this.statsFilterSlider;
      switch (statsFilter) {
        case 1:
          return "1 неделю";
        case 2:
          return "1 месяц";
        case 3:
          return "3 месяца";
        case 4:
          return "1 год";
        case 5:
          return "все время";
      }
      return name;
    },
    statsFilterСomputed() {
      let computed;
      let statsFilter = this.statsFilterSlider;
      switch (statsFilter) {
        case 1:
          return 0;
        case 2:
          return 4;
        case 3:
          return 12;
        case 4:
          return 52;
        case 5:
          return 52;
      }
      return computed;
    },
    churchData() {
      let resWeekDay = {};
      let resSunday = {};
      for (var k in this.stats) {
        resSunday[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter(
          (x) =>
            moment(x.date).format("d") == 0 &&
            this.statsFilterСomputed >= moment().diff(x.date, "weeks")
        ).length;

        resWeekDay[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter(
          (x) =>
            moment(x.date).format("d") != 0 &&
            this.statsFilterСomputed >= moment().diff(x.date, "weeks")
        ).length;
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