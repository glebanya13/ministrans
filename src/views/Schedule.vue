<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Имя</th>
                <th class="text-left">Вс</th>
                <th class="text-left">Будний</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in usersList"
                :key="item.name"
                @click="edit(item)"
                style="cursor: pointer"
              >
                <td>{{ item.name }} {{ item.surname }}</td>
                <td>{{ getSunday(item.schedule) }}</td>
                <td>{{ getWeekdays(item.schedule) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div class="text-center">
          <v-progress-circular
            v-if="getProcessing"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <br />
        <br />
        <v-tabs v-model="tab" centered>
          <v-tabs-slider></v-tabs-slider>
          <v-tab>Будние дни</v-tab>
          <v-tab>Воскресение</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Дата</th>
                    <th class="text-left">09:00</th>
                    <th class="text-left">18:00</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in weekDates"
                    :key="item.getTime()"
                    style="cursor: pointer"
                  >
                    <td>{{ item | moment("DD.MM.YY ddd") }}</td>
                    <td>{{ getUsersForDay(item.getDay(), "09:00") }}</td>
                    <td>{{ getUsersForDay(item.getDay(), "18:00") }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Время</th>
                    <th class="text-left">Министранты</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>09:30</td>
                    <td>{{ getUsersForDay(0, "09:30") }}</td>
                  </tr>
                  <tr>
                    <td>11:00</td>
                    <td>{{ getUsersForDay(0, "11:00") }}</td>
                  </tr>
                  <tr>
                    <td>13:00</td>
                    <td>{{ getUsersForDay(0, "13:00") }}</td>
                  </tr>
                  <tr>
                    <td>18:00</td>
                    <td>{{ getUsersForDay(0, "18:00") }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>

        <!-- <v-dialog
          v-model="dialog"
          width="500px"
        > -->
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
              <v-list-item dense>
                <v-row>
                  <v-col cols="1" class="text-align:center">ВС</v-col>
                  <v-col cols="11">
                    <v-btn-toggle
                      color="primary"
                      multiple
                      v-model="sundayTimes"
                    >
                      <v-btn class="ml-2">09:30</v-btn>
                      <v-btn class="ml-2">11:00</v-btn>
                      <v-btn class="ml-2">13:00</v-btn>
                      <v-btn class="ml-2">18:00</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
            <v-list dense v-for="x in weekdayTimes" :key="x.name">
              <v-list-item dense>
                <v-row>
                  <v-col cols="1">
                    <v-label class="ma-sm-4"> {{ x.name }}</v-label>
                  </v-col>
                  <v-col cols="11">
                    <v-btn-toggle color="primary" multiple v-model="x.times">
                      <v-btn class="ml-2">09:00</v-btn>
                      <v-btn class="ml-2">18:00</v-btn>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      tab: null,
      dialog: false,
      editableUser: {},
      sundayTimes: [],
      weekdayTimes: [
        {
          name: "ПН",
          times: [],
        },
        {
          name: "ВТ",
          times: [],
        },
        {
          name: "СР",
          times: [],
        },
        {
          name: "ЧТ",
          times: [],
        },
        {
          name: "ПТ",
          times: [],
        },
        {
          name: "СБ",
          times: [],
        },
      ],
      usersTempData: [
        {
          name: "Глеб",
          schedule: {
            vs: "09:30;11:00;18:00",
            pn: "",
            vt: "09:00",
            sr: "",
            cht: "",
            pt: "",
            sb: "",
          },
        },
        {
          name: "Женя",
          schedule: {
            vs: "09:30;11:00;18:00",
            pn: "",
            vt: "",
            sr: "",
            cht: "",
            pt: "",
            sb: "09:00",
          },
        },
        {
          name: "Макс",
          schedule: {
            vs: "09:30;11:00;18:00",
            pn: "",
            vt: "",
            sr: "09:00",
            cht: "",
            pt: "09:00",
            sb: "",
          },
        },
        {
          name: "Nikita",
          schedule: {
            vs: "09:30;11:00;18:00",
            pn: "",
            vt: "09:00",
            sr: "",
            cht: "09:00",
            pt: "09:00",
            sb: "09:00",
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["usersForSchedule", "getProcessing"]),
    usersList() {
      return this.usersForSchedule || this.usersTempData;
    },
    weekDates() {
      var res = [];
      var today = new Date();
      for (var i = 0; i < 7; i++) {
        let date = today.addDays(i);
        if (date.getDay() != 0) res.push(date);
      }
      return res;
    },
  },
  methods: {
    ...mapActions(["LOAD_USERS_FOR_SCHEDULE", "UPDATE_SCHEDULE_FOR_USER"]),
    getSunday(schedule) {
      return schedule.vs;
    },
    getWeekdays(schedule) {
      let weekdays = "";
      return weekdays.concat(
        schedule.pn ? `пн: ${schedule.pn}; ` : "",
        schedule.vt ? `вт: ${schedule.vt}; ` : "",
        schedule.sr ? `ср: ${schedule.sr}; ` : "",
        schedule.cht ? `чт: ${schedule.cht}; ` : "",
        schedule.pt ? `пт: ${schedule.pt}; ` : "",
        schedule.sb ? `сб: ${schedule.sb}; ` : ""
      );
    },
    edit(user) {
      this.editableUser = user;
      this.sundayTimes = convertSundayTime(user.schedule.vs);
      this.weekdayTimes[0].times = convertWeekdayTime(user.schedule.pn);
      this.weekdayTimes[1].times = convertWeekdayTime(user.schedule.vt);
      this.weekdayTimes[2].times = convertWeekdayTime(user.schedule.sr);
      this.weekdayTimes[3].times = convertWeekdayTime(user.schedule.cht);
      this.weekdayTimes[4].times = convertWeekdayTime(user.schedule.pt);
      this.weekdayTimes[5].times = convertWeekdayTime(user.schedule.sb);
      this.dialog = true;
    },
    update() {
      this.dialog = false;
      this.editableUser.schedule.vs = convertValuesForSunday(this.sundayTimes);
      this.editableUser.schedule.pn = convertValuesForWeekday(
        this.weekdayTimes[0].times
      );
      this.editableUser.schedule.vt = convertValuesForWeekday(
        this.weekdayTimes[1].times
      );
      this.editableUser.schedule.sr = convertValuesForWeekday(
        this.weekdayTimes[2].times
      );
      this.editableUser.schedule.cht = convertValuesForWeekday(
        this.weekdayTimes[3].times
      );
      this.editableUser.schedule.pt = convertValuesForWeekday(
        this.weekdayTimes[4].times
      );
      this.editableUser.schedule.sb = convertValuesForWeekday(
        this.weekdayTimes[5].times
      );
      this.UPDATE_SCHEDULE_FOR_USER(this.editableUser);

      this.editableUser = {};
    },
    getUsersForDay(targetDay, time) {
      return this.usersForSchedule
        .map((u) => {
          let res = "";
          switch (targetDay) {
            case 1:
              res = u.schedule.pn;
              break;
            case 2:
              res = u.schedule.vt;
              break;
            case 3:
              res = u.schedule.sr;
              break;
            case 4:
              res = u.schedule.cht;
              break;
            case 5:
              res = u.schedule.pt;
              break;
            case 6:
              res = u.schedule.sb;
              break;
            case 0:
              res = u.schedule.vs;
              break;
          }
          return res.indexOf(time) != -1 ? `${u.name} ${u.surname}; ` : "";
        })
        .join(" ");
    },
  },
  mounted() {
    this.LOAD_USERS_FOR_SCHEDULE();
  },
};

function convertValuesForSunday(values) {
  let sundayTimeValues = ["09:30", "11:00", "13:00", "18:00"];
  let res = values.map((x) => sundayTimeValues[x]);
  return res.join(";");
}
function convertValuesForWeekday(values) {
  let weekdayTimeValues = ["09:00", "18:00"];
  return values.map((x) => weekdayTimeValues[x]).join(";");
}
function convertSundayTime(time) {
  var res = [];
  time.split(";").forEach((e) => {
    switch (e) {
      case "09:30":
        res.push(0);
        break;
      case "11:00":
        res.push(1);
        break;
      case "13:00":
        res.push(2);
        break;
      case "18:00":
        res.push(3);
        break;
    }
  });
  return res;
}
function convertWeekdayTime(time) {
  var res = [];
  time.split(";").forEach((e) => {
    switch (e) {
      case "09:00":
        res.push(0);
        break;
      case "18:00":
        res.push(1);
        break;
    }
  });
  return res;
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
</script>

<style scoped>
</style>

