<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="500" outlined>
        <v-card-text>
          <h1 class="text-center black--text">Записаться на Имшу</h1><br>
          <h1 class="text-center black--text">Дата:</h1><br>
          <h1 class="text-center black--text">
            {{date}}
          </h1><br>
          <h1 class="text-center black--text">Время:</h1><br>
          <h1 class="text-center black--text">
            {{time}}
          </h1>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="450">
            <template v-slot:activator="{ on }">
              <v-btn class="primary" v-on="on">Изменить</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <h2 class="black--text">Изменить дату посещения</h2>
              </v-card-title>
              <v-card-text>

                <v-dialog
        ref="dialog1"
        v-model="modal"
        :return-value.sync="newdate"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="newdate"
            label="Выберите дату"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="newdate" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false">Отмена</v-btn>
          <v-btn text color="primary" @click="$refs.dialog1.save(newdate)">OK</v-btn>
        </v-date-picker>
      </v-dialog>

        <v-select
          v-if="isSunday == true"
          v-model="newtime"
          :items="timesSunday"
          menu-props="auto"
          label="Выберите время"
          hide-details
          prepend-icon="event"
          single-line
        ></v-select>

        <v-select
        v-if="isSunday == false"
          v-model="newtime"
          :items="timesDefault"
          menu-props="auto"
          label="Выберите время"
          hide-details
          prepend-icon="event"
          single-line
        ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = false">Отмена</v-btn>
                <v-btn color="primary" @click="save()">Сохранить</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn class="primary" @click="checkin()">Подтвердить</v-btn>
          <v-snackbar v-model="snackbar" bottom light color="green lighten-1">
                  <v-icon>check</v-icon> {{snackbarText}}
              </v-snackbar>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      day: new Date().getDay(),
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      newdate: new Date().toISOString().substr(0, 10),
      timesDefault: ['09:00', '18:00'],
      timesSunday: ['09:30', '11:00', '13:00', '18:00'],
      newtime: '',
      time: '09:00',
      snackbar: false,
      snackbarText: null,
    };
  },
  methods: {
    checkin() {
      this.$store.dispatch("CHECK_IN", {
        date: this.date,
        time: this.time,
        isSunday: this.isSunday,
      });
      this.snackbar = true
      this.snackbarText = "Поздравляем вы отметились!"
    },

    save() {
      this.date = this.newdate;
      this.time = this.newtime
      this.dialog = false
    },
  },
  computed: {
    newDay(){
      let newday = new Date(this.newdate).getDay()
      return newday
    },
    isSunday(){
      let isSunday = false
      if(this.newDay == 0){
        isSunday = true
      }
      if(this.day == 0){
        isSunday = true
      }
      return isSunday
    }
  },
}
</script>

<style>
</style>