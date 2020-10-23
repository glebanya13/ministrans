<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <div>
          <a @click="home()">
            <center>
              <v-img src="../assets/bird.png" width="50px" class="bird"></v-img>
            </center>
          </a>
        </div>
        <h1 class="text-center">Рады видеть Вас снова!</h1>
        <br />
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Вход</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-alert type="error" v-if="error">{{ error }}</v-alert>

          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                type="text"
                placeholder="Номер телефона"
                v-model="phNo"
              >
              </v-text-field>
              <v-text-field
                placeholder="Пароль"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="login()">Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import messages from "@/utils/messages.js";

import firebase from "firebase";
export default {
  data() {
    return {
      phNo: "",
      password: "",
      valid: false,
    };
  },
  computed: {
    error() {
      let e = this.$store.getters.getError;
      return e && (messages[e.code] || messages["default-error"]);
    },
  },
  methods: {
    // TODO: MOVE TO VUEX STORE
    login() {
      let vm = this;
      let email = this.phNo + "@site.com";
      let password = this.password;
      //
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function () {
          vm.$router.push({ path: "/" });
        })
        .catch(function (error) {
          console.log(error);

          let errMsg = error.message.toLowerCase();
          while (errMsg.indexOf("email") != -1) {
            errMsg = errMsg.replace("email address", "phone number");
          }
          alert(errMsg);
        });
    },
  },
};
</script>