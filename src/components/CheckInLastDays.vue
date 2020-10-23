<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" :loading="!userMassCheckins">
        <v-card-title>Мои последние посещения</v-card-title>
        <v-data-table
          :headers="headers"
          :items="userMassCheckins ? userMassCheckins : []"
          class="elevation-1"
          :loading="!userMassCheckins"
          :loading-text="loadingText"
        >
          <template v-slot:item.date="{ item }">
            {{ item.date | moment("DD.MM.YY ddd") }}
          </template>
          <template v-slot:item.id="{ item }">
            <v-icon style="cursor: pointer" @click="deleteDate(item.id)">
              mdi-delete-off</v-icon
            >
          </template>
        </v-data-table>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-chip class="ma-1 success">Всего: {{ allCheckinsCount }} / Вс: {{ sundayCheckinsCount }} / Будний: {{ weekdayCheckinsCount }}</v-chip>
              <v-chip class="ma-1 primary"
                >В этом месяце: {{ thisMonthCheckinsCount }} посетил. Осталось
                {{ thisMonthCheckinsSchedule() - thisMonthCheckinsCount }}</v-chip
              >
              <v-chip class="ma-1 error">Вс: {{ mySundays }} / {{ thisMonthSundayCheckinsCount  }} / {{getPercent(mySundays, thisMonthSundayCheckinsCount)}}</v-chip>
              <v-chip class="ma-1 warning">Будний: {{ myWeekdays }} / {{ thisMonthWeekdayCheckinsCount }} / {{getPercent(myWeekdays, thisMonthWeekdayCheckinsCount)}}</v-chip>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      headers: [
        {
          text: "День",
          align: "start",
          sortable: true,
          value: "date",
        },
        {
          text: "Время",
          sortable: false,
          value: "time",
        },
        {
          text: "",
          sortable: false,
          value: "id",
        },
      ],
      loading: true,
      loadingText: "Загрузка данных",
      mySundays: 0,
      myWeekdays: 0
    };
  },
  computed: {
    ...mapGetters(["userMassCheckins", "userId", "userData"]),
    allCheckinsCount() {
      return this.userMassCheckins ? this.userMassCheckins.length : 0;
    },
     sundayCheckinsCount() {
      return this.userMassCheckins ? this.userMassCheckins.filter(f => f.isSunday).length : 0;
    },
    weekdayCheckinsCount() {
      return this.userMassCheckins ? this.userMassCheckins.filter(f => !f.isSunday).length : 0;
    },
    thisMonthCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter(
            (f) =>
              moment(f.date, "yyyy-MM-DD").format("MM") == moment().format("MM")
          ).length
        : 0;
    },
    thisMonthSundayCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter(
            (f) =>
              moment(f.date, "yyyy-MM-DD").format("MM") == moment().format("MM") && f.isSunday
          ).length
        : 0;
    },
    thisMonthWeekdayCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter(
            (f) =>
              moment(f.date, "yyyy-MM-DD").format("MM") == moment().format("MM") && !f.isSunday
          ).length
        : 0;
    },
   
  },
  methods: {
    deleteDate(checkin) {
      Vue.$db.collection("massCheckins").doc(checkin).delete();
      this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER", this.userId);
    },
     thisMonthCheckinsSchedule() {
      if (this.userData && this.userData.myschedule) {
        let myDays = this.userData.myschedule
          .filter((s) => !s.alt)
          .map((s) => s.day);
        let alldays = moment().daysInMonth();
        let month = moment().format("MM");
        let year = moment().format("yyyy");
        let myDaysCount = 0;
        let mySundays = 0
        let myWeekdays = 0
        for (let i = 0; i < alldays; i++) {
          let day = parseInt(moment(`${year}-${month}-${i + 1}`).format("e"))
          if (myDays.indexOf(day) != -1)
          {
            myDaysCount++;
            if(day == 6){
              mySundays++
            }else{
              myWeekdays++
            }
          }
        }
        this.mySundays = mySundays
        this.myWeekdays = myWeekdays
        return myDaysCount;
      }
      return 0;
    },
    getPercent(all, part){
      return `${Math.round(100*part/all)}%`
    }
  },
  created() {
    this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER", this.userId);
    // if(this.userMassCheckins && this.userMassCheckins.length > 0)
    // {
    //   this.massCheckins = this.userMassCheckins
    //   this.loading = false;
    // }
    // this.$bus.$on("mass-checkins-for-user-are-loaded", () => {
    //   this.massCheckins = this.userMassCheckins
    //   this.loading = false;
    // });
  },
  // beforeDestroy() {
  //   this.$bus.$off("mass-checkins-for-user-are-loaded");
  // },
};
</script>

<style>
</style>