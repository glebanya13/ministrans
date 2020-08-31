<template>
  <v-card>
    <v-card-text>
      <h1 class="text-center">Здесь можно отметиться</h1>
      <h2>Выберите дату и время:</h2>

      <v-date-picker
        v-model="day"
        full-width
        :landscape="$vuetify.breakpoint.smAndUp"
        class="mt-4"
      ></v-date-picker>
      <v-time-picker
        v-model="time"
        format="24hr"
        full-width
        :landscape="$vuetify.breakpoint.smAndUp"
        class="mt-4"
      ></v-time-picker>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="checkin()">Отметиться</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      day: new Date().toISOString().substr(0, 10),
      time: new Date(),
    };
  },
  methods: {
    checkin() {
      this.$store.dispatch("CHECK_IN", {
        day: this.day,
        time: this.submittableDateTime
      });
    },
  },
  computed: {
    submittableDateTime() {
      const date = new Date(this.day)
      if(typeof this.time === 'string') {
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      }else {
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
      }
      return date
    }
  },
   
};
</script>

<style>
</style>