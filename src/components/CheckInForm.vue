<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="500" outlined>
        <v-card-text>
          <h1 class="text-center black--text">Вы сегодня были на Имше?</h1>
          <br />
        </v-card-text>

        <v-card-actions>
          <v-dialog v-model="dialog" persistent max-width="450">
            <template v-slot:activator="{ on }">
              <div class="center">
                <v-btn class="primary" v-on="on">Отметиться</v-btn>
              </div>
            </template>
            <v-card>
              <v-card-title>
                <h2 class="black--text">Выберите дату посещения</h2>
              </v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <v-alert type="warning" v-if="error">{{ error }}</v-alert>

                  <v-dialog
                    ref="dialog1"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="dateToView"
                        label="Выберите дату"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker v-model="date" :max="maxDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false"
                        >Отмена</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog1.save(date)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-dialog>

                  <v-select
                    v-if="isSunday == true"
                    v-model="time"
                    :items="timesSunday"
                    menu-props="auto"
                    label="Выберите время"
                    hide-details
                    prepend-icon="event"
                    single-line
                    :rules="timeRules"
                    required
                  ></v-select>

                  <v-select
                    v-if="isSunday == false"
                    v-model="time"
                    :items="timesDefault"
                    menu-props="auto"
                    label="Выберите время"
                    hide-details
                    prepend-icon="event"
                    single-line
                    :rules="timeRules"
                    required
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = false">Отмена</v-btn>
                <v-btn
                  color="primary"
                  @click.prevent="checkin()"
                  :disabled="processing || !valid"
                  >Подтвердить</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-snackbar v-model="snackbar" bottom light color="green lighten-1">
            <v-icon>check</v-icon> {{ snackbarText }}
          </v-snackbar>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      dialog: false,
      date: moment().format('yyyy-MM-DD'),//new Date().toISOString().substr(0, 10),
      modal: false,
      timesDefault: ["09:00", "18:00"],
      timesSunday: ["09:30", "11:00", "13:00", "18:00"],
      time: "",
      snackbar: false,
      snackbarText: null,
      valid: null,
      timeRules: [(v) => !!v || "Пожалуйста выберите время"],
    };
  },
  computed: {
    dateToView(){
       return this.date ? moment(this.date).format('LL (dddd)') : ''
    },
    maxDate(){
      return moment().format('yyyy-MM-DD')
    },
    massCheckins() {
      return this.$store.getters.massCheckins;
    },
    error() {
      return this.$store.getters.getError;
    },
    day() {
      let newday = new Date(this.date).getDay();
      return newday;
    },
    processing() {
      return this.$store.getters.getProcessing;
    },
    isSunday() {
      let isSunday = false;
      if (this.day == 0) {
        isSunday = true;
      }
      return isSunday;
    },
  },
  methods: {
    checkin() {
      this.$store.dispatch("CHECK_IN", {
        date: this.date,
        time: this.time,
        isSunday: this.isSunday,
      });
      this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER");
      this.dialog = false;
      this.snackbar = true;
      this.snackbarText = "Поздравляем, вы отметились!";
    },
  },
};
</script>

<style>
.center {
  width: 100%;
  text-align: center;
}
</style>