<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined>
        <v-card-title>
          <h2 class="text-wrap text-center" v-if="tab == '0'">
            Вы сегодня были на Имше?
          </h2>
          <h2 class="text-wrap text-center" v-if="tab == '1'">
            Вы сегодня были на встрече?
          </h2>
        </v-card-title>
        <br />
        <v-card-actions>
          <v-dialog v-model="excuseDialog" persistent max-width="450">
            <template v-slot:activator="{ on }">
              <div class="center">
                <v-btn class="primary float-right mr-1" v-on="on"
                  >Извиниться</v-btn
                >
              </div>
            </template>
            <v-card>
              <v-card-title>Опишите причину</v-card-title>
              <v-card-text>
                <v-textarea
                  name="input-7-1"
                  label="Причина"
                  required
                  v-model="problem"
                  :rules="rules"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="excuseDialog = false"
                  >Отмена</v-btn
                >
                <v-btn color="primary" @click="send()">Отправить</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="checkinDialog" persistent max-width="450">
            <template v-slot:activator="{ on }">
              <div class="center">
                <v-btn class="primary float-left ml-1" v-on="on"
                  >Отметиться</v-btn
                >
              </div>
            </template>
            <v-card>
              <v-card-title>Выберите дату посещения</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
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
                    v-if="tab == '0'"
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
                  <v-time-picker
                    v-if="time == 'Другое'"
                    v-model="customTime"
                    :allowed-minutes="allowedCustomTimeStep"
                    class="mt-4"
                    format="24hr"
                    :rules="timeRules"
                  ></v-time-picker>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="checkinDialog = false"
                  >Отмена</v-btn
                >
                <v-btn
                  color="primary"
                  @click.prevent="checkin()"
                  :disabled="
                    processing ||
                    !valid ||
                    (time == customTimeText && customTime == '')
                  "
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
import moment from "moment";
import { mapGetters } from "vuex";
import helpers from "@/utils/helpers.js";

export default {
  props: ["tab"],
  data() {
    return {
      checkinDialog: false,
      excuseDialog: false,
      rules: [(v) => !!v || "Пожалуйста заполните поле"],
      problem: "Извиняюсь, не пришел по тому что:",
      date: moment().format("yyyy-MM-DD"), //new Date().toISOString().substr(0, 10),
      modal: false,
      timesDefault: {},
      time: "",
      snackbar: false,
      snackbarText: null,
      valid: null,
      customTime: "",
      customTimeText: "Другое",
      timeRules: [(v) => !!v || "Пожалуйста выберите время"],
    };
  },
  computed: {
    ...mapGetters(["parish", "userData"]),
    dateToView() {
      return this.date ? moment(this.date).format("LL (dddd)") : "";
    },
    maxDate() {
      return moment().format("yyyy-MM-DD");
    },
    massCheckins() {
      return this.$store.getters.massCheckins;
    },
    error() {
      return this.$store.getters.getError;
    },
    // day() {
    //   return moment(this.date, "yyyy-MM-DD").format("e"); // sunday == 6
    // },
    processing() {
      return this.$store.getters.getProcessing;
    },
    timesToChoose() {
      let times = this.timesDefault[this.day]
        ? this.timesDefault[this.day]
        : this.timesDefault[7]; // for weekday
      if (!times) {
        times = [];
      }
      times.push({ time: this.customTimeText });
      return times && times.map((td) => td.time);
    },
  },
  methods: {
    send() {
      console.log(
        this.userData.myschedule
          .filter((x) => x.day != 6)
          .map((x) => x.day + " " + x.time)
      );
    },
    allowedCustomTimeStep: (m) => m % 15 === 0,
    checkin() {
      this.$refs.form.validate();
      if (this.valid) {
        this.$store.dispatch("CHECK_IN", {
          date: this.date,
          time: this.time != this.customTimeText ? this.time : this.customTime,
          isSunday: this.day == 6,
          isMeeting: this.tab == 1,
          tab: this.tab,
        });
        this.$store.dispatch("LOAD_MASS_CHECKINS_BY_USER", {
          tab: this.tab,
          uid: this.$store.getters.userId,
        });
        this.dialog = false;
        this.snackbar = true;
        this.snackbarText = "Поздравляем, вы отметились!";
      }
    },
    assignTimes() {
      if (this.parish.schedule) {
        this.timesDefault = helpers.groupByKey(this.parish.schedule, "day");
      }
    },
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
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
.center {
  width: 100%;
  text-align: center;
}
</style>