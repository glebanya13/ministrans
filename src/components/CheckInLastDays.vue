<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" :loading="!userMassCheckins">
        <v-card-title>Мои последние посещения</v-card-title>
        <v-card-subtitle>
          <v-row v-if="tab == '0'">
            <v-col>
              <v-chip class="ma-1 success"
                >Всего: {{ allCheckinsCount }} / Вс: {{ sundayCheckinsCount }} /
                Будний: {{ weekdayCheckinsCount }}</v-chip
              >
              <v-chip class="ma-1 primary">
                В месяце: {{ thisMonthCheckinsCount }} раз(а) из
                {{ thisMonthCheckinsSchedule() }} по графику
              </v-chip>
              <v-chip class="ma-1 error"
                >Вс: {{ thisMonthSundayCheckinsCount }} из {{ mySundays }} ({{
                  getPercent(mySundays, thisMonthSundayCheckinsCount)
                }})</v-chip
              >
              <v-chip class="ma-1 warning"
                >Будний: {{ thisMonthWeekdayCheckinsCount }} из
                {{ myWeekdays }} ({{
                  getPercent(myWeekdays, thisMonthWeekdayCheckinsCount)
                }})</v-chip
              >
            </v-col>
          </v-row>
          <v-row align="center" justify="center" v-else>
            <v-col cols="12" sm="4">
              <v-chip class="ma-1 success"
                >Всего: {{ allCheckinsCount }} раз в месяц</v-chip
              >
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-data-table
          :headers="headers"
          :items="checkins ? checkins : []"
          class="elevation-1"
          :loading="!checkins"
          :loading-text="loadingText"
        >
          <template v-slot:item.date="{ item }">
            {{ `${item.date}` | moment("DD.MM.YY ddd") }} {{ item.time }}
          </template>
          <template v-slot:item.id="{ item }">
            <v-icon
              style="cursor: pointer"
              @click="deleteDate(item)"
              :disabled="disableRemove || getProcessing"

            >
              mdi-delete-off</v-icon
            >
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
// import Vue from "vue";
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
          text: "",
          sortable: false,
          value: "id",
        },
      ],
      loading: true,
      loadingText: "Загрузка данных",
      mySundays: 0,
      myWeekdays: 0,
    };
  },
  props: ["targetId", "disableRemove", "tab"],
  computed: {
    ...mapGetters([
      "getProcessing",
      "userMassCheckins",
      "userMeetingCheckins",
      "userId",
      "userData",
    ]),
    allCheckinsCount() {
      let all;
      if (this.tab == "0") {
        all = this.userMassCheckins ? this.userMassCheckins.length : 0;
      }
      if (this.tab == "1") {
        all = this.userMeetingCheckins ? this.userMeetingCheckins.length : 0;
      }
      return all;
    },
    checkins() {
      let array;
      if (this.tab == "0") {
        array = this.userMassCheckins;
      }
      if (this.tab == "1") {
        array = this.userMeetingCheckins;
      }
      return array;
    },
    sundayCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter((f) => this.isSunday(f.date)).length
        : 0;
    },
    weekdayCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter((f) => this.isSunday(f.date)).length
        : 0;
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
              moment(f.date, "yyyy-MM-DD").format("MM") ==
                moment().format("MM") && this.isSunday(f.date)
          ).length
        : 0;
    },
    thisMonthWeekdayCheckinsCount() {
      return this.userMassCheckins
        ? this.userMassCheckins.filter(
            (f) =>
              moment(f.date, "yyyy-MM-DD").format("MM") ==
                moment().format("MM") && !this.isSunday(f.date)
          ).length
        : 0;
    },
  },
  methods: {
    isSunday(date) {
      return moment(date, "yyyy-MM-DD").format("e") == 6;
    },
    deleteDate(checkin) {
    this.$store.dispatch('DELETE_CHECKIN', {checkin: checkin, id: checkin.id, tab: this.tab})
      
      let ref;
      
      if (this.disableRemove) return ref;
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
        let mySundays = 0;
        let myWeekdays = 0;
        for (let i = 0; i < alldays; i++) {
          let day = parseInt(moment(`${year}-${month}-${i + 1}`).format("e"));
          if (myDays.indexOf(day) != -1) {
            myDaysCount++;
            if (day == 6) {
              mySundays++;
            } else {
              myWeekdays++;
            }
          }
        }
        this.mySundays = mySundays;
        this.myWeekdays = myWeekdays;
        return myDaysCount;
      }
      return 0;
    },
    getPercent(all, part) {
      return `${Math.round((100 * part) / all)}%`;
    },
  },
  created() {
    this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER", {
      uid: this.targetId || this.userId,
      tab: this.tab,
    });
  },
  //   if(this.userMassCheckins && this.userMassCheckins.length > 0)
  //   {
  //     this.massCheckins = this.userMassCheckins
  //     this.loading = false;
  //   }
  //   this.$bus.$on("mass-checkins-for-user-are-loaded", () => {
  //     this.massCheckins = this.userMassCheckins
  //     this.loading = false;
  //   });
  // },
  // beforeDestroy() {
  //   this.$bus.$off("mass-checkins-for-user-are-loaded");
  // },
};
</script>

<style>
</style>