<template>
  <div>
    <v-simple-table dense loading="true">
      <template v-slot:default>
        <thead>
          <tr>
            <th :class="showHeaders">Имя</th>
            <th class="text-left">Воскресенье</th>
            <th class="text-left">Будний</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in usersList"
            :key="item.uid"
            @click="edit(item)"
            style="cursor: pointer"
          >
            <td :class="showHeaders">{{ item.name }} {{ item.surname }}</td>
            <td>{{ showSunday(item.myschedule) }}</td>
            <td>{{ showWeekdays(item.myschedule) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center">
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="pa-3">
        <v-toolbar fixed dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Изменить расписание</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="update()"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-title headline
          >{{ editableUser.name }} {{ editableUser.surname }}</v-card-title
        >
        <v-list dense>
          <v-list-item
            dense
            v-for="(ttch, i) in timesToChoose"
            :key="ttch.name + Math.random()"
            :class="showAlternativeDayIfAvalable(i)"
          >
            <v-row>
              <v-col
                cols="2"
                align="center"
                justify="center"
                class="text-h6 text-uppercase"
                offset="0"
                >{{ ttch.name }}</v-col
              >
              <v-col cols="9">
                <v-btn-toggle color="primary" v-model="ttch.result">
                  <v-btn
                    :disabled="disableTimeIfChosen(j, i)"
                    v-for="(t, j) in ttch.times"
                    :key="t.time"
                    class="ml-2"
                    >{{ t }}</v-btn
                  >
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="update()">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import helpers from "@/utils/helpers.js";
import moment from "moment";

export default {
  data() {
    return {
      editableUser: {},
      dialog: false,
      usersList: [],
      loading: true,
      timesToChoose: [],
    };
  },
  props:['targetId', 'hideHeaders'],
  computed: {
    ...mapGetters([
      "parish",
      "users",
      "userId",
      "isAdmin",
      "isPriest",
      "isSenior",
    ]),
    showHeaders(){
      return !this.hideHeaders ? '' : 'd-none'
    },
  },
  methods: {
    ...mapActions(["UPDATE_SCHEDULE_FOR_USER"]),
    disableTimeIfChosen(itemIndex, currentDayIndex) {
      if (this.timesToChoose[currentDayIndex].number != 6) return;
      let chosen = [];
      for (let i = 0; i < currentDayIndex; i++) {
        chosen.push(this.timesToChoose[i].result);
      }
      return chosen.indexOf(itemIndex) != -1;
    },
    showAlternativeDayIfAvalable(i) {
      if (i == 0 || this.timesToChoose[i].number != 6) return "";

      return this.timesToChoose[i - 1].result >= 0 ? "" : "d-none";
    },
    edit(item) {
      this.checkPermissions(item.uid, () => {
        this.editableUser = item;
        this.matchEditableUserSchedule();
        this.dialog = true;
      });
    },
    update() {
      this.editableUser.myschedule = [];
      let altSundayIndex = 0;
      this.timesToChoose.forEach((t) => {
        if (t.times[t.result]) {
          let chosenTime = {
            day: t.number,
            time: t.times[t.result],
          };
          // add alt prop for sunday time
          if (t.number == 6) {
            if (altSundayIndex > 0) {
              chosenTime.alt = altSundayIndex + 1;
            }
            altSundayIndex += 1;
          }
          this.editableUser.myschedule.push(chosenTime);
        }

        // unset chosen time
        t.result = -1;
      });
      this.UPDATE_SCHEDULE_FOR_USER(this.editableUser);
      this.editableUser = {};
      this.dialog = false;
    },
    showSunday(schedule) {
      if (schedule) {
        let i = 1;
        return schedule
          .filter((s) => s.day == 6)
          .map((sch) =>
            i > 0
              ? `${this.getDayOfWeek(6)}-${i++}: ${sch.time}`
              : `${this.getDayOfWeek(6)}: ${sch.time}`
          )
          .join("; "); //add sort
      } else return "";
    },
    showWeekdays(schedule) {
      if (schedule) {
        return schedule
          .filter((s) => s.day != 6)
          .map((sch) => `${this.getDayOfWeek(sch.day)}:${sch.time}`)
          .join("; "); //add sort
      } else return "";
    },
    getDayOfWeek(num) {
      return num == 7 ? "будний" : moment(num, "e").format("ddd");
    },
    assignSchedule() {
      if (this.parish && this.parish.schedule) {
        let timeGroups = helpers.groupByKey(this.parish.schedule, "day");
        // for Sunday
        if (timeGroups[6]) {
          let sundayTimes = timeGroups[6].map((t) => t.time);
          for (let i = 0; i < sundayTimes.length; i++) {
            this.timesToChoose.push({
              name:
                i > 0
                  ? `${this.getDayOfWeek(6)} (${i + 1})`
                  : `${this.getDayOfWeek(6)}`,
              number: 6,
              times: sundayTimes,
              result: -1,
            });
          }
        }
        // for Weekday
        if (timeGroups[7]) {
          let weekTimes = timeGroups[7].map((t) => t.time);
          for (var i = 0; i < 6; i++) {
            this.timesToChoose.push({
              name: `${this.getDayOfWeek(i)}`,
              number: i,
              times: timeGroups[i]
                ? timeGroups[i].map((t) => t.time)
                : weekTimes,
              result: -1,
            });
          }
        }
      }
    },
    matchEditableUserSchedule() {
      if (this.editableUser.myschedule) {
        let uSchedule = this.editableUser.myschedule;
        this.timesToChoose.forEach((t) => {
          let found = uSchedule.findIndex((f) => f.day == t.number);
          if (found >= 0) {
            t.result = t.times.indexOf(uSchedule[found].time);
            uSchedule.splice(found, 1);
          } else {
            t.result = -1;
          }
        });
      }
    },
    checkPermissions(uid, func) {
      //TODO - refactoring: check permission checkRole(roleName)
      if (this.isAdmin) {
        func();
      } else {
        if (this.isPriest) {
          func();
        } else {
          if (this.isSenior) {
            func();
          } else {
            if (uid == this.userId) {
              func();
            }
          }
        }
      }
      return false;
    },
  },
  created() {
    if (this.users && this.users.length >= 0) {
      this.usersList = this.users.filter(u => this.targetId ? u.uid == this.targetId : true);
      this.usersList = this.usersList.filter(u => u.level != "Ксендз" );
      this.loading = false;
    }
    this.$bus.$on("users-are-loaded", () => {
      this.usersList = this.users.filter(u =>  this.targetId ? u.uid == this.targetId : true);
      this.usersList = this.usersList.filter(u => u.level != "Ксендз" );
      this.loading = false;
    });
    if (this.parish) {
      this.assignSchedule();
    }
    this.$bus.$on("parish-is-loaded", () => {
      this.assignSchedule();
    });
  },
  beforeDestroy() {
    this.$bus.$off("users-are-loaded");
    this.$bus.$off("parish-is-loaded");
  },
};
</script>