<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap align-center justify-center class="hidden-sm-and-down">
      <v-flex xs12>
        <h1 class="text-center">График министрантов</h1>
      </v-flex>
      <v-flex xs12 md6 xl4>
        <v-card width="400" outlined class="elevation-0 transparent mx-auto" >
          <bar-chart
            xtitle="Посещения Имш"
            ytitle="Министранты"
            :data="churchData"
            width="400px"
            height="600px"
            :stacked="true"
          ></bar-chart>
          <v-slider v-model="slider1" :label="`Посещения за ${sliderLabel}`" max="5" min="1"></v-slider>
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
    <v-layout row wrap  align-center justify-center class="hidden-md-and-up">
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
          <v-slider v-model="slider1" :label="`Посещения за ${sliderLabel}`" max="5" min="1"></v-slider>
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
import moment from 'moment'

export default {
  data(){
    return {
      slider1: 1
    }
  },
  computed: {
    ...mapGetters(["stats", "meetingStats"]),
    sliderLabel(){
      let label
      if(this.slider1 == 1){
        label = "1 неделю"
      }
      if(this.slider1 == 2){
        label = "1 месяц"
      }
      if(this.slider1 == 3){
        label = "3 месяца"
      }
      if(this.slider1 == 4){
        label = "1 год"
      }
      if(this.slider1 == 5){
        label = "все время"
      }
      return label
    },
    weekComputed(){
      var a
      if(this.slider1 == 1){
        a = 0
      }
      if(this.slider1 == 2){
        a = 4
      }
      if(this.slider1 == 3){
        a = 12
      }
      if(this.slider1 == 4){
        a = 52
      }
      if(this.slider1 == 5){
        a = 52
      }
      return a
    },
    churchData() {
      let resWeekDay = {};
      let resSunday = {};
      for (var k in this.stats) {
        resSunday[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => x.isSunday && this.weekComputed >= moment().diff(x.date, 'weeks')).length;
        
        resWeekDay[
          `${this.stats[k][0].name} ${this.stats[k][0].surname}`
        ] = this.stats[k].filter((x) => !x.isSunday && this.weekComputed >= moment().diff(x.date, 'weeks')).length;
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