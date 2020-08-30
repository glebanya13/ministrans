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
            <v-alert type="warning" :value="error">{{error}}</v-alert>

            <v-form v-model="valid">
              <v-text-field
                label="Никнейм"
                name="nickname"
                prepend-icon="mdi-account"
                type="text"
                required
                v-model="nickName"
                :rules="nickNameRules"
              ></v-text-field>

              <v-text-field
                label="Аватар"
                prepend-icon="mdi-image"
                required
                v-model="photoURL"
                :rules="photoURLRules"
              ></v-text-field>

              <v-text-field
                label="Е-мейл"
                name="login"
                prepend-icon="mdi-email"
                type="email"
                required
                v-model="email"
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click.prevent="signup()"
              :disabled="processing || !valid"
            >Далее</v-btn>
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
      email: null,
      password: null,
      nickName: null,
      valid: null,
      photoURL: null,
      emailRules: [
        (v) => !!v || "Пожалуйста введите е-мейл",
        (v) => /.+@.+\..+/.test(v) || "Неправильный е-мейл",
      ],
      passwordRules: [
        (v) => !!v || "Пожалуйста введите пароль",
        (v) =>
          (v && v.length >= 6) ||
          "Пароль слишком короткий - минимум 6 символов",
      ],
      nickNameRules: [(v) => !!v || "Пожалуйста введите ваше имя"],
      photoURLRules: [(v) => !!v || "Пожалуйста введите адресную строку вашей фотографии"]
    };
  },
  computed: {
    processing() {
      return this.$store.getters.getProcessing;
    },
    error() {
      return this.$store.getters.getError;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    
  },
  watch: {
    isUserAuthenticated(val) {
      if (val === true) this.$router.push("/signup2");
    },
  },
  methods: {
    signup() {
      this.$store.dispatch("SIGNUP", {
        email: this.email,
        password: this.password,
        nickName: this.nickName,
        photoURL: this.photoURL
      });
    },
  },
};
</script>

<style>
</style>