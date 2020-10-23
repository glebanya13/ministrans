<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <v-card>
          <v-card-title>{{
            parish ? parish.name : "Нет прихода"
          }}</v-card-title>
          <div>
            <v-card-subtitle> Расписание имш </v-card-subtitle>
          </div>
          <v-card-text>
            <div v-show="!editMode">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="d in scheduleToView" :key="d.day + Date.now()">
                      <td>{{ d.day }}</td>
                      <td v-for="t in d.times" :key="t.time + Date.now()">
                        {{ t.time }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div v-show="editMode">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-for="(s, index) in scheduleToUpdate"
                      :key="s.day + s.time + Date.now()"
                    >
                      <td>{{ getDayOfWeek(s.day) }}</td>
                      <td>{{ s.time }}</td>
                      <td>
                        <v-icon
                          style="cursor: pointer"
                          @click="deleteTime(index)"
                        >
                          mdi-delete-off</v-icon
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-row dense align="center" justify="center">
                <v-col col-4>
                  <v-overflow-btn
                    dense
                    class="my-2"
                    label="День"
                    :items="availableDays"
                    v-model="selectedDay"
                    item-value="val"
                    item-text="text"
                  ></v-overflow-btn>
                </v-col>
                <v-col col-4
                  ><v-overflow-btn
                    dense
                    class="my-2"
                    label="Время"
                    :items="availableTimes"
                    v-model="selectedTime"
                  ></v-overflow-btn>
                </v-col>
                <v-col col-4>
                  <v-btn text @click="addTime()"> Добавить </v-btn></v-col
                >
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-show="!editMode" text @click="editMode = true">
              Изменить
            </v-btn>
            <v-btn v-show="editMode" text @click="updateSchedule()">
              Обновить
            </v-btn>
            <v-btn v-show="editMode" text @click="editMode = false">
              Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import helpers from "@/utils/helpers.js";
import moment from "moment";

export default {
  data() {
    return {
      currentSchedule: [],
      scheduleToUpdate: [],
      needUpdate: false,
      selectedDay: 6,
      selectedTime: null,
      editMode: false,
    };
  },
  computed: {
    ...mapGetters(["parish"]), //???
    scheduleToView() {
      let schedule = [];
      if (this.parish && this.parish.schedule) 
      {
        let groups = helpers.groupByKey(this.parish.schedule, "day");

        // add Sunday
        if (groups[6]) {
          schedule.push({
            day: this.getDayOfWeek(6),
            times: groups[6],
          });
          delete groups[6];
        }
        // add Weekdays
        if (groups[7]) {
          schedule.push({
            day: this.getDayOfWeek(7),
            times: groups[7],
          });
          delete groups[7];
        }
        for (var g in groups) {
          schedule.push({
            day: this.getDayOfWeek(g),
            times: groups[g],
          });
        }
      }
      return schedule;
    },
    availableDays() {
      let result = [];
      for (var i = 7; i > -1; i--) {
        result.push({ text: this.getDayOfWeek(i), val: i });
      }
      return result;
    },
    availableTimes() {
      let start = moment("00:00", "H:mm");
      let result = [start.format("H:mm")];
      for (var i = 0; i < 47; i++) {
        result.push(start.add(30, "minutes").format("H:mm"));
      }
      return result;
    },
  },
  methods: {
    ...mapMutations(["SET_MESSAGE"]),
    ...mapActions(["LOAD_PARISH", "UPDATE_MASS_SCHEDULE"]),
    deleteTime(index) {
      this.scheduleToUpdate.splice(index, 1);
      this.needUpdate = true;
    },
    addTime() {
      if (this.selectedDay && this.selectedTime) {
        this.scheduleToUpdate.push({
          day: this.selectedDay,
          time: this.selectedTime,
        });
        this.needUpdate = true;
      } else {
        this.SET_MESSAGE("Выберите день и время");
      }
    },
    updateSchedule() {
      this.UPDATE_MASS_SCHEDULE(this.scheduleToUpdate);
      this.currentSchedule = this.scheduleToUpdate;
      this.editMode = false;
      this.SET_MESSAGE("Обновляем");
    },
    getDayOfWeek(num) {
      return num == 7 ? "будний" : moment(num, "e").format("ddd");
    },
    //TODO - если нет ни одного времени в расписании - показать сообщение!
  },
  created() {
    let s = this.parish ? this.parish.schedule : [];
    if (s && s.length > 0) {
      s = s.sort((a, b) => a.day - b.day);
    }
    this.scheduleToUpdate = this.currentSchedule = s;
  },
};
</script>

<style>
</style>