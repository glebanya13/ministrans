<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="cs in currentSchedule" :key="cs.week">
        {{ getDayOfWeek(6) }} {{ cs.week }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="cs in currentSchedule" :key="cs.week">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="1%">Время</th>
                <th class="text-left">Министранты</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in cs.times" :key="t.time + Math.random()">
                <td width="1%">{{ t.time }}</td>
                <td>
                  {{ t.users.map((u) => `${u.name} ${u.surname}`).join(";") }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//import helpers from "@/utils/helpers.js";
import moment from "moment";

export default {
  data() {
    return {
      tab: null,
      currentSchedule: [],
      usersList: [],
      loading: true,
      sundayTimes: [],
    };
  },

  computed: {
    ...mapGetters(["parish", "users"]),
  },
  methods: {
    getDayOfWeek(num) {
      return num == 7 ? "будний" : moment(num, "e").format("ddd");
    },
    assignSchedule() {
      if (this.parish && this.parish.schedule) {
        this.sundayTimes = this.parish.schedule
          .filter((s) => s.day == 6)
          .map((su) => {
            return {
              users: [],
              ...su,
            };
          });

        this.currentSchedule = [];
        for (let i = 0; i < this.sundayTimes.length; i++) {
          this.currentSchedule.push({
            week: i + 1,
            times: this.sundayTimes.map((st) => {
              return { time: st.time, users: [] };
            }),
          });
        }
      }
    },
    assignUsers() {
      if (this.sundayTimes.length > 0) {
        this.usersList.forEach((u) => {
          if (u.myschedule) {
            let sundays = u.myschedule.filter((ms) => ms.day == 6);
            if (sundays.length == 1) {
              // for same schedule every week
              for (let i = 0; i < this.sundayTimes.length; i++) {
                let week = this.currentSchedule[i];
                if (week) {
                  let time = week.times.find((t) => t.time == sundays[0].time);
                  if (time) {
                    time.users.push(u);
                  }
                }
              }
            } else {
              //for alternative schedule
              sundays.forEach((sun) => {
                let week = this.currentSchedule[sun.alt ? sun.alt - 1 : 0];
                if (week) {
                  let time = week.times.find((t) => t.time == sun.time);
                  if (time) {
                    time.users.push(u);
                  }
                }
              });
            }
          }
        });
      }
    },
  },
  created() {
    if (this.usersList) {
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