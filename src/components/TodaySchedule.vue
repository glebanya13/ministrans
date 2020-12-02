<template>
  <v-card tile :loading="loading">
    <v-card-title
      >{{ today | moment("LL (dddd)") }} | Неделя {{ weekNumber }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left px-1" width="1%">Время</th>
              <th class="text-left px-1">Министранты</th>
              <th class="text-left px-1" width="1%">Посещение</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in todayTimes" :key="t + Math.random()">
              <td width="1%" class="px-1">{{ t }}</td>
              <td class="px-1">
                <v-chip
                  :color="getUserState(user)"
                  class="ml-2 mt-1 mb-1"
                  outlined
                  v-for="user in currentState[t]"
                  :key="user.name + t + Math.random()"
                >
                  {{ user.name }}
                </v-chip>
              </td>
              <td width="1%" class="px-1">
                  <v-chip text-color="white" :class="getStatColor(currentState[t])">{{getStat(currentState[t])}}</v-chip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
        <v-row><v-col>
             <v-chip color="red" outlined class="ma-1">Пропустил</v-chip
      ><v-chip color="green" outlined class="ma-1">Пришел</v-chip
      ><v-chip color="" class="ma-1" outlined>Еще можно прийти</v-chip
      ><v-chip class="ma-1" color="primary" outlined
        >Пришел в другое время</v-chip>
            </v-col></v-row>
     
      
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import helpers from "@/utils/helpers.js";
export default {
  data() {
    return {
      today: moment("2020-10-18"),
      usersList: null,
      loading: true,
      currentState: {},
      todayTimes: [],
    };
  },
  props: {
    targetDate: String,
  },
  computed: {
    ...mapGetters(["users", "parish", "dateCheckins"]),
    weekNumber() {
      return this.today.week() % 4 + 1; //TODO: assign first week in parish module
    },
  },
  methods: {
    ...mapActions(["LOAD_MASS_CHECKINS_BY_DATE"]),
    getStatColor(users){
        let done = users.filter(u => u.done || u.free).length
        return done/users.length > 50 ? 'primary' : 'red'
    },
    getStat(users){
        let done = users.filter(u => u.done || u.free).length
        let missed = users.filter(u => u.waiting || u.missed).length
        return `${done}/${missed}/${Math.round(done*100/users.length)}%`
    },
    getUserState(user) {
      if (user.done) {
        return "green";
      }
      if (user.waiting) {
        return "";
      }
      if (user.missed) {
        return "red";
      }
      // came but didn't have to
      if (user.free) {
        return "primary";
      }
    },
    assignSchedule() {
      if (this.parish && this.parish.schedule) {
        this.loading = false
        let todayNumber = this.today.format("e");
        
        let todayTimes = this.parish.schedule
          .filter((s) => s.day == todayNumber)
          .map((st) => st.time);
        if (todayTimes.length == 0 && todayNumber != 6) {
          todayTimes = this.parish.schedule
            .filter((s) => s.day == 7)
            .map((st) => st.time);
        }

        if (todayTimes.length == 0) return;
        let checkins = this.dateCheckins ? helpers.groupByKey(this.dateCheckins, "uid") : {};

        this.currentState = {};
        todayTimes.forEach((tt) => (this.currentState[tt] = []));

        this.usersList.forEach((u) => {
          let uData = {
            name: `${u.name} ${u.surname}`,
          };
          if (u.myschedule) {
            let myTimeItems = u.myschedule
              .filter((ms) => ms.day == todayNumber);
              
            if (todayNumber == 6) {
              if (this.weekNumber == 1) {
                myTimeItems = myTimeItems.filter((ti) => !ti.alt);
              } else if (u.myschedule.find((ms) => ms.alt)) {
                myTimeItems = myTimeItems.filter(
                  (ms) => ms.alt == this.weekNumber
                );
              }
            }

            let myTodayTimes = myTimeItems.map((tt) => tt.time);
            let myCheckins = checkins[u.uid];

            if (myTodayTimes.length > 0 && !myCheckins) {
              myTodayTimes.forEach((tt) => {
                if (this.currentState[tt]) {
                  this.currentState[tt].push({
                    ...uData,
                    waiting: this.today.isBefore(moment(tt, "H:mm")),
                    missed: !this.today.isBefore(moment(tt, "H:mm")),
                  });
                }
              });
              return;
            }
            if (myTodayTimes.length == 0 && myCheckins) {
              myCheckins.forEach((ch) => {
                if (this.currentState[ch.time]) {
                  this.currentState[ch.time].push({ ...uData, free: true });
                }
              });
              return;
            }
            if (myCheckins) {
              myCheckins.forEach((ch) => {
                let elemIndex = myTodayTimes.indexOf(ch.time);
                if (elemIndex != -1) {
                  if (this.currentState[ch.time]) {
                    this.currentState[ch.time].push({ ...uData, done: true });
                  }
                  myTodayTimes.splice(elemIndex, 1);
                } else {
                  if (this.currentState[ch.time]) {
                    this.currentState[ch.time].push({ ...uData, free: true });
                  }
                }
              });
            }
            myTodayTimes.forEach((tt) => {
              if (this.currentState[tt]) {
                if (myCheckins) return; // min one time came
                this.currentState[tt].push({
                  ...uData,
                  waiting: this.today.isBefore(moment(tt, "H:mm")),
                  missed: !this.today.isBefore(moment(tt, "H:mm")),
                });
              }
            });
          }
        });
        this.todayTimes = todayTimes;
      }
    },
  },
  watch:{
    dateCheckins(){
      this.assignSchedule()
    }
  },
  created() {
      this.today = moment(this.targetDate)
    this.LOAD_MASS_CHECKINS_BY_DATE(this.today.format("yyyy-MM-DD"));
    if (this.users && this.users.length > 0) {
      this.usersList = this.users;
    }
    this.$bus.$on("users-are-loaded", () => {
      this.usersList = this.users;
        this.assignSchedule();
    });
    // if (this.parish) {
    //   this.assignSchedule();
    //   this.loading = false;
    // }
    this.$bus.$on("parish-is-loaded", () => {
      this.assignSchedule();
    });
    this.assignSchedule();
  },
  beforeDestroy() {
    this.$bus.$off("users-are-loaded");
    this.$bus.$off("parish-is-loaded");
  },
};
</script>
<style scoped>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>