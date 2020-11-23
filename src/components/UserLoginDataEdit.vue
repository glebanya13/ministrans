<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Данные входа</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="error" :value="error" type="error">{{
              error
            }}</v-alert>
            <v-form v-model="valid">
              <v-text-field
                v-if="credential == 'phone,password'"
                label="Номер телефона"
                name="phone"
                prepend-icon="email"
                type="text"
                required
                v-model="phone"
                :rules="phoneRules"
              ></v-text-field>

              <v-text-field
                v-if="credential == 'password'"
                label="Е-мейл"
                name="login"
                prepend-icon="email"
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

              <h3>Изменение пароля</h3>
              <v-text-field
                label="Новый пароль"
                id="password"
                name="newPassword"
                prepend-icon="mdi-lock"
                type="password"
                required
                v-model="newPassword"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="{ name: 'profile' }">Отмена</v-btn>
            <v-btn
              color="primary"
              @click.prevent="changeUserData()"
              :disabled="getProcessing || !valid"
              >Изменить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import messages from "@/utils/messages.js";
import firebase from "firebase";
export default {
  data() {
    return {
      dialogAva: false,
      changeType: "email",

      newPhotoUrl: null,

      email: null,
      phone: null,
      password: null,

      newEmail: null,
      newPassword: null,

      valid: false,

      emailRules: [
        (v) => !!v || "Пожалуйста введите е-мейл",
        (v) => /.+@.+\..+/.test(v) || "Неправильный е-мейл",
      ],
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш телефон",
        (v) => (v && v.length >= 12) || "Неверный формат телефона",
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
    ...mapGetters(["getProcessing"]),
    error() {
      let e = this.$store.getters.getError;
      return e && (messages[e.code] || messages["default-error"]);
    },
    credential() {
      let user = firebase.auth().currentUser;
      let id = user.providerData.map((d) => d.providerId).toString();
      return id;
    },
    updateData() {
      let update;
      if (this.phone) {
        update = this.phone + "@site.com";
      }
      if (this.email) {
        update = this.email;
      }
      return update;
    },
  },
  methods: {
    ...mapActions(["CHANGE_USER_LOGIN_DATA"]),
    changeUserData() {
      this.CHANGE_USER_LOGIN_DATA({
        updateData: this.updateData,
        password: this.password,
        newPassword: this.newPassword,
      });
    },
  },
  created() {
    this.$bus.$on("user-profile-data-changed", () => {
      this.$router.push("/profile");
    });
  },
  beforeDestroy() {
    this.$bus.$off("user-profile-data-changed");
  },
};
</script>