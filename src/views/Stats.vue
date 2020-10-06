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
  data() {
    return {
      mappedData: new Map(),
    };
  },

  computed: {
    ...mapGetters(["stats"]),

    chartsData() {
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
          name: "ВС",
          data: resSunday,
        },
        {
          name: "Будние",
          data: resWeekDay,
        },
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