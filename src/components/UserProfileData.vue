<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined>
        <v-card-text>
          <v-flex class="mb-4">
            <v-avatar size="100" class="mr-4">
              <img src="https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/user.png?alt=media&token=4ebbd785-fb2e-4022-b4e6-98a4d4761511" />
            </v-avatar>
          <!-- <v-dialog v-model="dialogAva" persistent max-width="320">
            <template v-slot:activator="{ on }">
            <v-btn v-on="on">Изменить Аватар</v-btn>
            </template>
            <v-card>
              <v-card-title>Вы точно хотите поменять аватар?</v-card-title> -->
              <!-- <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Аватар"
                    prepend-icon="mdi-image"
                    required
                    v-model="newPhotoUrl"
                    :rules="photoURLRules"
                  ></v-text-field>
                  </v-form>
              </v-card-text> -->
              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialogAva = false">Отмена</v-btn>
                <v-btn
                  color="primary"
                  @click.prevent="changeImage()"
                  :disabled="getProcessing || !valid"
                >Изменить</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
          </v-flex>
          <h2 class="headline mb-0">
            <h4 v-if="!userName && !userSurname"><v-icon>person</v-icon> Нет данных</h4>
            <h4 v-if="userBirthday"><v-icon>person</v-icon> {{userName}} {{userSurname}}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4><v-icon>email</v-icon> {{userEmail}}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userBirthday"><v-icon>mdi-calendar-today</v-icon> Нет данных</h4>
            <h4 v-if="userBirthday"><v-icon>mdi-calendar-today</v-icon> {{userBirthday}}</h4>
            
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userClas"><v-icon>mdi-book-outline</v-icon> Нет данных</h4>
            <h4 v-if="userClas"><v-icon>mdi-book-outline</v-icon> {{userClas}}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userLevel"><v-icon>mdi-star</v-icon> Нет данных</h4>
            <h4 v-if="userLevel"><v-icon>mdi-star</v-icon> {{userLevel}}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userParafia"><v-icon>mdi-church</v-icon> Нет данных</h4>
            <h4 v-if="userParafia"><v-icon>mdi-church</v-icon> {{userParafia}}</h4>
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="550">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on">Управление данными</v-btn>
            </template>
              <v-tabs v-model="tabMode" fixed-tabs>
                <v-tab :key="'reduct'" ripple>
                  Изменить параметры входа
              </v-tab>
              <v-tab :key="'add'">
                  Персональные данные
              </v-tab>
              <v-tab-item :key="'reduct'">
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
                <v-btn color="primary" @click="dialog = false">Отмена</v-btn>
                <v-btn
                  color="primary"
                  @click.prevent="changeUserData()"
                  :disabled="getProcessing || !valid"
                >Изменить</v-btn>
              </v-card-actions>
            </v-card>
              </v-tab-item>
              <v-tab-item :key="'add'">
                <v-card>
                  <v-card-title class="headline">Добавить/изменить персональные данные?</v-card-title>
                  <v-card-text>
                    <h2>Перейдя по этой ссылке, вы можете добавить свои данные или изменить:
                    <a href="/signup2">переход</a></h2>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">Закрыть окно</v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              </v-tabs>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      tabMode: 'reduct',

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
    ...mapGetters(["userName", "userClas", "userLevel", "userSurname", "userEmail", "getProcessing", "getError", "userBirthday", "userParafia"]),
    // photoUrl() {
    //   return this.$store.getters.userPhoto;
    // },
  },
  methods: {
    changeUserData() {
      this.$store.dispatch("CHANGE_USER_PROFILE_DATA", {
        email: this.email,
        password: this.password,
        newEmail: this.newEmail,
        newPassword: this.newPassword,
        changeType: this.changeType,
      });
    },
    changeImage(){
      this.$store.dispatch("CHANGE_USER_IMAGE", {
        newPhotoUrl: this.newPhotoUrl
      })
      this.dialogAva = false
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