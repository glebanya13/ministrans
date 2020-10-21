<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <today-schedule :target-date="targetDate"></today-schedule>

        <v-tabs v-model="mainTab">
          <v-tab>Дни</v-tab>
          <v-tab>Министранты</v-tab>
        </v-tabs>
        <v-tabs-items v-model="mainTab">
          <v-tab-item>
            <v-row>
              <v-col>
                <v-expansion-panels popout multiple v-model="panel">
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Воскресение
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <sunday-schedule></sunday-schedule>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Будний
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <weekday-schedule></weekday-schedule>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <schedule-for-users> </schedule-for-users>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
//import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import ScheduleForUsers from "@/components/ScheduleForUsers";
import SundaySchedule from "@/components/SundaySchedule";
import WeekdaySchedule from "@/components/WeekdaySchedule";
import TodaySchedule from "@/components/TodaySchedule";
export default {
  data() {
    return {
      panel: [],
      mainTab: null,
      targetDate: moment().format("yyyy-MM-DD"), // today
    };
  },
  mounted() {
    this.panel.push(moment().format("e") == 6 ? 0 : 1); //expend for sunday or for weekday
  },
  components: {
    ScheduleForUsers,
    SundaySchedule,
    WeekdaySchedule,
    TodaySchedule,
  },
};
</script>

<style scoped>
</style>

