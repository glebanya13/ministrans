<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined>
        <v-card-text>
          <v-flex class="mb-4">
            <v-avatar size="100" class="mr-4">
              <v-img :src="defaultImg"></v-img>
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
            <h4 v-if="!userName && !userSurname">
              <v-icon>person</v-icon> Нет данных
            </h4>
            <h4 v-if="userBirthday">
              <v-icon>person</v-icon> {{ userName }} {{ userSurname }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4><v-icon>email</v-icon> {{ userEmail }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userBirthday">
              <v-icon>mdi-calendar-today</v-icon> Нет данных
            </h4>
            <h4 v-if="userBirthday">
              <v-icon>mdi-calendar-today</v-icon>
              {{ userBirthday | moment("DD MMMM YYYY") }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userClas">
              <v-icon>mdi-book-outline</v-icon> Нет данных
            </h4>
            <h4 v-if="userClas">
              <v-icon>mdi-book-outline</v-icon> {{ userClas }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userLevel"><v-icon>mdi-star</v-icon> Нет данных</h4>
            <h4 v-if="userLevel"><v-icon>mdi-star</v-icon> {{ userLevel }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!userParafia"><v-icon>mdi-church</v-icon> Нет данных</h4>
            <h4 v-if="userParafia">
              <v-icon>mdi-church</v-icon> {{ userParafia }}
            </h4>
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn :to="{name: 'edit-profile', params:{tab:1}}">Управление данными</v-btn>
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
      defaultImg:
        "https://firebasestorage.googleapis.com/v0/b/ministrans-60ff9.appspot.com/o/user.png?alt=media&token=4ebbd785-fb2e-4022-b4e6-98a4d4761511",

    };
  },
  computed: {
    ...mapGetters([
      "userName",
      "userClas",
      "userLevel",
      "userSurname",
      "userEmail",
      "getProcessing",
      "getError",
      "userBirthday",
      "userParafia",
    ]),
    // photoUrl() {
    //   return this.$store.getters.userPhoto;
    // },
  }
};
</script>

<style>
</style>