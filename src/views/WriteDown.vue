<template>
<v-container fluid>
    <v-layout column>
  <v-card class="mx-auto" width="800" outlined>
    <v-card-text>
      <h2 class="text-center">Здесь можно отметиться</h2>
      <h3>Выберите дату и время:</h3>
      <v-date-picker v-model="date"
      full-width
      :landscape="$vuetify.breakpoint.smAndUp"
      class="mt-4">
      </v-date-picker>

        <v-select
          v-model="day"
          :items="days"
          menu-props="auto"
          label="Выберите день"
          hide-details
          prepend-icon="mdi-calendar-today"
          single-line
        ></v-select>

<v-radio-group v-if="day == 'Будний день'" v-model="timeb" :mandatory="false">
      <v-radio label="9:00" value="timeb-1"></v-radio>
      <v-radio label="18:00" value="timeb-2"></v-radio>
    </v-radio-group>

    <v-radio-group v-if="day == 'Воскресение'" v-model="times" :mandatory="false">
      <v-radio label="9:30" value="times-1"></v-radio>
      <v-radio label="11:00" value="times-2"></v-radio>
      <v-radio label="13:00" value="times-3"></v-radio>
      <v-radio label="18:00" value="times-4"></v-radio>
    </v-radio-group>

    <v-radio-group v-if="day == 'Праздничный день'" v-model="timec" :mandatory="false">
      <v-radio label="10:00" value="timec-1"></v-radio>
      <v-radio label="12:00" value="timec-2"></v-radio>
      <v-radio label="18:00" value="timec-3"></v-radio>
    </v-radio-group>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="checkin()">Отметиться</v-btn>
    </v-card-actions>
  </v-card>
    </v-layout>
</v-container>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      days: ['Будний день', 'Воскресение', 'Праздничный день'],
      day: 'Будний день',
      timeb: 'timeb-1',
      times: 'times-1',
      timec: 'timec-1'
      // time: new Date(),
    };
  },
  methods: {
    // checkin() {
    //   this.$store.dispatch("CHECK_IN", {
    //     date: this.submittableDateTime,
    //   });
    // },
  },
  // computed: {
  //   submittableDateTime() {
  //     const date = new Date(this.date)
  //     if(typeof this.time === 'string') {
  //       const hours = this.time.match(/^(\d+)/)[1]
  //       const minutes = this.time.match(/:(\d+)/)[1]
  //       date.setHours(hours)
  //       date.setMinutes(minutes)
  //     }else {
  //       date.setHours(this.time.getHours())
  //       date.setMinutes(this.time.getMinutes())
  //     }
  //     return date
  //   }
  // },
   
};
</script>

<style>
</style>