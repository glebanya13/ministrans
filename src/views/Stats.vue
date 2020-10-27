<template>
  <div class="small">
     <bar-chart xtitle="Посещения" ytitle="Министранты" :stacked="true"
      :data="chartsData"
    ></bar-chart>
    <!-- <bar-chart
      xtitle="Посещения"
      ytitle="Министранты"
      :stacked="true"
      :data="[
        {
          name: 'Workout',
          data: { ss: 3, ee: 5 },
        },
        {
          name: 'Workout 1',
          data: { ss: 2, ee: 6 },
          color: '#b00',
        },
      ]"
    ></bar-chart> -->
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["stats", "meetingStats"]),

    chartsData() {
      let resWeekDay = {};
      let resSunday = {};
      let resMeets = {};
      for (var k in this.stats) {
        resSunday[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => x.isSunday).length;
        resWeekDay[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => !x.isSunday).length;
        
      }
      for (var key in this.meetingStats) {
      resMeets[
          `${this.meetingStats[key][0].name} ${this.meetingStats[key][0].surname}`
        ] = this.meetingStats[key].filter((x) => x.isMeeting).length;
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
        {
          name: "Встречи",
          data: resMeets,
        }
      ];
    },
  },
  methods: {
    ...mapActions(["LOAD_STATS"])
  },
  created() {
    this.LOAD_STATS();
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>