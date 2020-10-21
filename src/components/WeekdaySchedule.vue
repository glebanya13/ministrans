<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" width="1%">День</th>
            <th
              v-for="wt in weekTimes"
              :key="wt + Math.random()"
              class="text-left"
            >
              {{ wt }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="wd in weekDays" :key="wd + Math.random()">
            <td width="1%">{{ getDayOfWeek(wd) }}</td>
            <td v-for="wt in weekTimes" 
            :key="wt + Math.random()">
              {{ getUsersForDayTime(wd, wt) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/utils/helpers.js";
import moment from "moment";

export default {
  data() {
    return {
      currentSchedule: [],
      usersList: [],
      loading: true,
      weekdayTimes: [],
      weekTimes: [],
    };
  },

  computed: {
    ...mapGetters(["parish", "users"]),
    weekDays() {
      return [0, 1, 2, 3, 4, 5];
    },
  },
  methods: {
    getUsersForDayTime(day, time) {
      if (this.currentSchedule[day] && this.currentSchedule[day][time])
        return this.currentSchedule[day][time].map(user => `${user.name} ${user.surname}`).join("; ");
      return "";
    },
    getDayOfWeek(num) {
      return num == 7 ? "будний" : moment(num, "e").format("ddd");
    },
    assignSchedule() {
      if (this.parish && this.parish.schedule) {
        let allTimes = [];
        let weekdayTimes = helpers.groupByKey(
          this.parish.schedule
            .filter((s) => s.day != 6)
            .map((su) => {
              if (allTimes.indexOf(su.time) == -1) {
                allTimes.push(su.time);
              }
              return su;
            }),
          "day"
        );
        this.weekTimes = allTimes.sort(
          (a, b) => moment(a, "H:mm") - moment(b, "H:mm")
        );

        this.currentSchedule = {};
        let general = weekdayTimes[7];
        for (let i = 0; i < 6; i++) {
          this.currentSchedule[i] = {};
          if (weekdayTimes[i]) {
            weekdayTimes[i].forEach((wdt) => {
              this.currentSchedule[i][wdt.time] = [];
            });
          } else if (general) {
            general.forEach((wdt) => {
              this.currentSchedule[i][wdt.time] = [];
            });
          }
        }
      }
    },
    assignUsers() {
      if (this.weekTimes.length > 0) {
        this.usersList.forEach((u) => {
          if (u.myschedule) {
            u.myschedule.forEach((d) => {
            //for custom week day
              if (d.day != 7 && d.day != 6) {
                if (
                  this.currentSchedule[d.day] &&
                  this.currentSchedule[d.day][d.time]
                )
                  this.currentSchedule[d.day][d.time].push(u);
              }
              // for general week day
              if (d.day == 7) {
                for (let i = 0; i < 6; i++) {
                  if (
                    this.currentSchedule[i] &&
                    this.currentSchedule[i][d.time]
                  )
                    this.currentSchedule[d.day][d.time].push(u);
                }
              }
            });
          }
        });
      }
    },
  },
  created() {
    if (this.users) {
      this.usersList = this.users;
    }
    this.$bus.$on("users-are-loaded", () => {
      this.usersList = this.users;
      this.assignSchedule();
      this.assignUsers();
    });
    if (this.parish) {
      this.assignSchedule();
      this.assignUsers();
      this.loading = false;
    }
    this.$bus.$on("parish-is-loaded", () => {
      this.assignSchedule();
      this.assignUsers();
      this.loading = false;
    });
  },
  beforeDestroy() {
    this.$bus.$off("users-are-loaded");
    this.$bus.$off("parish-is-loaded");
  },
};
</script>