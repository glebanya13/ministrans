<template>
  <v-container fluid>
    <v-layout column>
      <v-flex class="mb-4">
        <h1 class="text-center">Migration</h1>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-card width="400" outlined>
              <v-card-title
                ><h2>Инструкция</h2>
                <v-icon class="float-right" @click.stop="show = !show"
                  >mdi-chevron-down</v-icon
                ></v-card-title
              >

              <v-card-text>
                <transition name="slide-fade">
                  <ul class="black--text" v-if="show">
                    <li>
                      Подключитесь к базе, в которой хотите забрать данные;
                    </li>
                    <li>Нажмите на кнопку данных, которое хотите забрать;</li>
                    <li>Скопируйте их;</li>
                    <li>Подключитесь к базе, куда осуществляется перенос;</li>
                    <li>Раскомментируйте строку, с нужным action;</li>
                    <li>Вставьте в поле;</li>
                    <li>Нажмите на кнопку Accept;</li>
                    <li>Готово</li>
                  </ul>
                </transition>
              </v-card-text>
            </v-card>
            <v-card width="400" outlined>
              <v-card-title>Выберите данные</v-card-title>
              <v-card-text>
                <ul class="black--text">
                  <li>
                    <v-btn color="primary" @click="usersData()">Users</v-btn> -
                    данные всех пользователей;
                  </li>
                  <br />
                  <li>
                    <v-btn color="success" @click="churchData()">Church</v-btn>
                    - данные посещений в костёл;
                  </li>
                  <br />
                  <li>
                    <v-btn color="indigo" dark @click="meetings()"
                      >Meetings</v-btn
                    >
                    - данные посещений встреч министрантов
                  </li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col class="float-right" cols="12" sm="6">
            <v-card width="400" outlined>
              <v-card-title><h2>Данные</h2></v-card-title>
              <v-card-text>
                <v-textarea
                  name="input-7-1"
                  label="Данные"
                  v-model="data"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-btn :disabled="!data" @click="loadJSON()" color="success"
          >Accept</v-btn
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      data: "",
    };
  },
  methods: {
    loadJSON() {
      // this.$store.dispatch('LOAD_MEET_DATA', this.data)
      // this.$store.dispatch('LOAD_MARKS_DATA', this.data)
      this.$store.dispatch("LOAD_USERS_DATA", this.data);
    },
    usersData() {
      var x = JSON.stringify(this.users);
      this.data = x;
    },
    churchData() {
      var x = JSON.stringify(this.massCheckins);
      this.data = x;
    },
    meetings() {
      var x = JSON.stringify(this.meetingCheckins);
      this.data = x;
    },
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    massCheckins() {
      return this.$store.getters.massCheckins;
    },
    meetingCheckins() {
      return this.$store.getters.meetingCheckins;
    },
    filejson() {
      var x = JSON.stringify(this.users);
      return x;
    },
  },
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>