<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined>
        <v-card-title >
          <h2 class="text-wrap text-center">  Вы сегодня были на Имше?</h2>
        </v-card-title>
 <br />
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
                    v-model="time"
                    :items="timesToChoose"
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
import { mapGetters } from "vuex";
import helpers from "@/utils/helpers.js"; 

export default {
  data() {
    return {
      dialog: false,
      date: moment().format('yyyy-MM-DD'),//new Date().toISOString().substr(0, 10),
      modal: false,
      timesDefault: {},
      time: "",
      snackbar: false,
      snackbarText: null,
      valid: null,
      timeRules: [(v) => !!v || "Пожалуйста выберите время"],
    };
  },
  computed: {
    ...mapGetters(['parish']),
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
      return moment(this.date, 'yyyy-MM-DD').format('e') // sunday == 6
    },
    processing() {
      return this.$store.getters.getProcessing;
    },
    timesToChoose(){
      let times = this.timesDefault[this.day] 
      ? this.timesDefault[this.day] 
      : this.timesDefault[7] // for weekday
      return times && times.map(td => td.time)
       
    }
  },
  methods: {
    checkin() {
      this.$store.dispatch("CHECK_IN", {
        date: this.date,
        time: this.time,
        isSunday: this.day == 6,
      });
      this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER");
      this.dialog = false;
      this.snackbar = true;
      this.snackbarText = "Поздравляем, вы отметились!";
    },
    assignTimes(){
      if(this.parish.schedule){
        this.timesDefault = helpers.groupByKey(this.parish.schedule, 'day')
      }
    }
  },
  created() {
    if (this.parish) {
      this.assignTimes();
    }
    this.$bus.$on("parish-is-loaded", () => {
      this.assignTimes();
    });
  },
  beforeDestroy() {
    this.$bus.$off("parish-is-loaded");
  },
};
</script>

<style scoped>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
.center {
  width: 100%;
  text-align: center;
}
</style>