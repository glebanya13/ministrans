<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Регистрация</v-toolbar-title>
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
                type="month"
                prepend-icon="mdi-calendar-today"
                required
                v-model="birthday"
                :rules="dataRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
      levels: ["Асперант", "Министрант", "Лектар", "Ксендз"],
      birthday: null,
      clas: null,
      name: null,
      surname: null,
      level: null,
      valid: null,

      nameRules: [(v) => !!v || "Пожалуйста введите ваше имя"],
      surnameRules: [(v) => !!v || "Пожалуйста введите вашу фамилию"],
      levelsRules: [(v) => !!v || "Пожалуйста выберите ваше звание"],
      classesRules: [(v) => !!v || "Пожалуйста выберите ваш класс"],
      dataRules: [(v) => !!v || "Пожалуйста введите дату рождения"],
    };
  },
  computed: {
    processing() {
      return this.$store.getters.getProcessing;
    },
  },
  methods: {
    personal() {
      this.$store.dispatch("ADD_USER_DATA", {
        level: this.level,
        birthday: this.birthday,
        clas: this.clas,
        name: this.name,
        surname: this.surname,
      });
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>