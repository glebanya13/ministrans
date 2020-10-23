<template>
 <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Персональные данные</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                label="Имя"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                required
                v-model="name"
                :rules="nameRules"
              ></v-text-field>

              <v-text-field
                label="Фамилия"
                name="surname"
                prepend-icon="mdi-account"
                type="text"
                required
                v-model="surname"
                :rules="surnameRules"
              ></v-text-field>

              <v-text-field
                label="Номер телефона"
                name="phone"
                prepend-icon="phone"
                type="text"
                required
                v-model="phone"
                :rules="phoneRules"
              ></v-text-field>

              <v-overflow-btn
                class="my-2"
                label="Парафия"
                prepend-icon="mdi-church"
                required
                :items="parishes"
                item-text="name"
                item-value="id"
                v-model="parish"
                :rules="parafiasRules"
              ></v-overflow-btn>

              <v-overflow-btn
                class="my-2"
                label="Класс"
                prepend-icon="mdi-book-outline"
                required
                :items="classes"
                v-model="clas"
                :rules="classesRules"
              ></v-overflow-btn>

              <v-overflow-btn
                class="my-2"
                label="Звание"
                prepend-icon="mdi-star"
                required
                :items="levels"
                v-model="level"
                :rules="levelsRules"
              ></v-overflow-btn>

              <v-text-field
                label="Дата рождения"
                type="date"
                prepend-icon="mdi-calendar-today"
                required
                v-model="birthday"
                :rules="dataRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn to="/">Заполнить позже</v-btn> -->
            <v-btn
              color="primary"
              @click.prevent="personal()"
              :disabled="processing || !valid"
            >Подтвердить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>    
<script>
import {mapActions,mapGetters} from 'vuex'
export default {
  data() {
    return {
      classes: [
        "Школу не начинал",
        "Первый",
        "Второй",
        "Третий",
        "Четвертый",
        "Пятый",
        "Шестой",
        "Седьмой",
        "Восьмой",
        "Девятый",
        "Десятый",
        "Одиннадцатый",
        "Школу закончил",
      ],
      levels: ["Аспирант", "Министрант", "Лектар", "Ксендз"],

      birthday: null,
      parish: null,
      clas: null,
      name: null,
      surname: null,
      phone: null,
      level: null,
      valid: null,

      nameRules: [(v) => !!v || "Пожалуйста введите ваше имя"],
      surnameRules: [(v) => !!v || "Пожалуйста введите вашу фамилию"],
      phoneRules: [(v) => !!v || "Пожалуйста введите ваш номер телефона"],
      levelsRules: [(v) => !!v || "Пожалуйста выберите ваше звание"],
      classesRules: [(v) => !!v || "Пожалуйста выберите ваш класс"],
      dataRules: [(v) => !!v || "Пожалуйста введите дату рождения"],
      parafiasRules: [(v) => !!v || "Пожалуйста выберите вашу парафию"],
    };
  },
  computed: {
    ...mapGetters(['userId', 'userData', 'parishList']),
    processing() {
      return this.$store.getters.getProcessing;
    },
    parishes(){
      return this.parishList || []
    }
  },
  methods: {
    ...mapActions(['LOAD_USER_DATA', 'LOAD_ALL_PARISHES']),
    personal() {

let parishItem = this.parishList.find(p => p.id == this.parish) || {}

      this.$store.dispatch("BATCH", {name: this.name,
      surname: this.surname});
      this.$store.dispatch("ADD_USER_DATA", {
        level: this.level,
        birthday: this.birthday,
        clas: this.clas,
        name: this.name, 
        surname: this.surname,
        parish:  {
          name: parishItem.name,
          id: parishItem.id
        },
        userId: this.userId,
        phone: this.phone
      });
      this.$router.push("/profile");
    },

  },
  mounted() {
     
    this.$bus.$on("user-data-loaded", () => {
        this.level = this.userData.level
        this.birthday = this.userData.birthday
        this.clas = this.userData.clas
        this.name = this.userData.name
        this.surname = this.userData.surname
        this.clas = this.userData.clas
        this.parish = this.userData.parish ? this.userData.parish.id : ''
        this.phone = this.userData.phone
    });
    this.$bus.$on("user-data-loaded", (

    ) => {})
    //this.LOAD_USER_DATA(this.userId);
  },
  created(){
    this.LOAD_ALL_PARISHES()
    if(this.parishList){
      //this.parishes = this.parishList
    }
  },
  beforeDestroy() {
    this.$bus.$off("user-data-loaded");
    this.$bus.$off("parish-is-loaded");
  },
};
</script>
<style scoped>

</style>