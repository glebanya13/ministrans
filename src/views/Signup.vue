<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1 class="text-center">Добро пожаловать!</h1><br>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Регистрация</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
          <v-alert type="error" v-if="error">{{error}}</v-alert>

            <v-form v-model="valid">

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
          
          <v-card-text>
            <h2 class="black--text">Или:</h2> <br>
            <v-btn class="indigo white--text" @click="phone()"><v-icon>phone</v-icon>Телефон</v-btn>
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
// import phoneAuth from '../components/PhoneAuth'
import messages from '@/utils/messages.js'
export default {
  data() {
    return {
      email: null,
      password: null,
      valid: null,
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
    };
  },
  computed: {
    processing() {
      return this.$store.getters.getProcessing;
    },
    error() {
      let e = this.$store.getters.getError
      return e && (messages[e.code] || messages['default-error']);
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    }
    
  },
  watch: {
    isUserAuthenticated(val) {
      if (val === true) this.$router.push({name: "edit-profile", params:{tab:1}});
    },
  },
  methods: {
    phone(){
      this.$router.push({ path: '/phone' })
    },
    signup() {
      this.$store.dispatch("SIGNUP", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style>

</style>