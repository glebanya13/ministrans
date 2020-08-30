<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="500" outlined>
        <v-card-text>
          <v-flex class="mb-4">
            <v-avatar size="100" class="mr-4">
              <img :src="photoUrl" />
            </v-avatar>
          <v-dialog v-model="dialogAva" persistent max-width="320">
            <template v-slot:activator="{ on }">
            <v-btn v-on="on">Изменить Аватар</v-btn>
            </template>
            <v-card>
              <v-card-title>Вы точно хотите поменять аватар?</v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Аватар"
                    prepend-icon="mdi-image"
                    required
                    v-model="newPhotoUrl"
                    :rules="photoURLRules"
                  ></v-text-field>
                  </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialogAva = false">Отмена</v-btn>
                <v-btn
                  color="primary"
                  @click.prevent="changeImage()"
                  :disabled="getProcessing || !valid"
                >Изменить</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </v-flex>
          <h2 class="headline mb-0">
            <v-icon>person</v-icon>
            {{userName}}
          </h2>
          <h2 class="headline mb-0">
            <v-icon>email</v-icon>
            {{userEmail}}
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="550">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on">Изменить мои данные</v-btn>
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
                    <v-radio label="Никнейм" value="name"></v-radio>
                    <v-text-field
                      label="Новый никнейм"
                      v-if="changeType == 'name'"
                      name="newNickName"
                      prepend-icon="person"
                      type="text"
                      required
                      v-model="newNickName"
                      :rules="nickNameRules"
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
                  @click.prevent="changeUserData()"
                  :disabled="getProcessing || !valid"
                >Изменить</v-btn>
              </v-card-actions>
            </v-card>
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
      dialogAva: false,
      changeType: "name",

      newPhotoUrl: null,

      email: null,
      password: null,

      newNickName: null,
      newEmail: null,
      newPassword: null,

      valid: false,

      nickNameRules: [(v) => !!v || "Пожалуйста введите пароль"],
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
      photoURLRules: [(v) => !!v || "Пожалуйста введите адресную строку вашей фотографии"]

    };
  },
  computed: {
    ...mapGetters(["userName", "userEmail", "getProcessing", "getError"]),
    photoUrl() {
      return this.$store.getters.userPhoto;
    },
  },
  methods: {
    changeUserData() {
      this.$store.dispatch("CHANGE_USER_PROFILE_DATA", {
        email: this.email,
        password: this.password,
        newNickName: this.newNickName,
        newEmail: this.newEmail,
        newPassword: this.newPassword,
        changeType: this.changeType,
      });
    },
    changeImage(){
      this.$store.dispatch("CHANGE_USER_IMAGE", {
        newPhotoUrl: this.newPhotoUrl
      })
    }
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