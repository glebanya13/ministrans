<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            <v-icon>person</v-icon>
            {{userName}}
          </h3>
          <h3 class="headline mb-0">
            <v-icon>email</v-icon>
            {{userEmail}}
          </h3>
          <h3 class="headline mb-0">
            <v-icon>mdi-calendar-today</v-icon>
            {{userBirthday}}
          </h3>
          <h3 class="headline mb-0">
            <v-icon>mdi-star</v-icon>
            {{userLevel}}
          </h3>
          <h3 class="headline mb-0">
            <v-icon>mdi-book-outline</v-icon>
            {{userClass}}
          </h3>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="550">
          <template v-slot:activator="{ on }">
            <v-btn color="orange" v-on="on">Изменить мои данные</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Изменить мои данные?</v-card-title>
            <v-card-text>
              <v-alert :value="getError" type="warning">{{getError}}</v-alert>
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
                  <v-radio label="Имя" value="name"></v-radio>
                  <v-text-field
                    label="Новое имя"
                    v-if="changeType == 'name'"
                    name="newName"
                    prepend-icon="person"
                    type="text"
                    required
                    v-model="newName"
                    :rules="nameRules"
                  ></v-text-field>
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
              <v-btn color="green darken-1" @click="dialog = false">Отмена</v-btn>
              <v-btn
                color="green darken-1"
                @click.prevent="changeUserData"
                :disabled="getProcessing || !valid"
              >Изменить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      changeType: "name",

      email: null,
      password: null,

      newName: null,
      newEmail: null,
      newPassword: null,

      valid: false,

      nameRules: [(v) => !!v || "Пожалуйста введите пароль"],
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
    ...mapGetters(["userName", "userEmail", "userBirthday", "userLevel", "userClass", "getProcessing", "getError"]),
  },
  methods: {
    changeUserData() {
      this.$store.dispatch("CHANGE_USER_PROFILE_DATA", {
        email: this.email,
        password: this.password,
        newName: this.newName,
        newEmail: this.newEmail,
        newPassword: this.newPassword,
        changeType: this.changeType,
      });
    },
  },
  created() {
    this.$bus.$on("user-profile-data-changed", () => {
      this.dialog = false;
    });
  },
  beforeDestroy() {
    this.$bus.$off("user-profile-data-changed");
  },
};
</script>

<style>
</style>