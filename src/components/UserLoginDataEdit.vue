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
            <v-alert v-if="error" :value="error" type="error">{{ error }}</v-alert>
            <v-form v-model="valid">
              <v-text-field
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
              <h3>Я хочу изменить</h3>
              <v-radio-group v-model="changeType">
                <v-radio label="Е-мейл" value="email"></v-radio>
                <v-text-field
                  label="Новый е-мейл"
                  v-if="changeType == 'email'"
                  name="newLogin"
                  prepend-icon="email"
                  type="email"
                  required
                  v-model="newEmail"
                  :rules="emailRules"
                ></v-text-field>
                <v-radio label="Пароль" value="password"></v-radio>
                <v-text-field
                  label="Новый пароль"
                  v-if="changeType == 'password'"
                  id="password"
                  name="newPassword"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                  v-model="newPassword"
                  :rules="passwordRules"
                ></v-text-field>
              </v-radio-group>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="{name: 'profile'}"
              >Отмена</v-btn
            >
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
import messages from '@/utils/messages.js'
export default {
  data() {
    return {
      dialogAva: false,
      changeType: "email",

      newPhotoUrl: null,

      email: null,
      password: null,

      newEmail: null,
      newPassword: null,

      valid: false,

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
      // photoURLRules: [(v) => !!v || "Пожалуйста введите адресную строку вашей фотографии"]
    };
  },
  computed: {
    ...mapGetters(['getProcessing']),
    error(){
      let e = this.$store.getters.getError
      return  e && (messages[e.code] || messages['default-error']);
    }
    },
  methods: {
      ...mapActions(['CHANGE_USER_LOGIN_DATA']),
    changeUserData() {
      this.CHANGE_USER_LOGIN_DATA({
        email: this.email,
        password: this.password,
        newEmail: this.newEmail,
        newPassword: this.newPassword,
        changeType: this.changeType,
      });
    },
    // changeImage() {
    //   this.$store.dispatch("CHANGE_USER_IMAGE", {
    //     newPhotoUrl: this.newPhotoUrl,
    //   });
    //   this.dialogAva = false;
    // },
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