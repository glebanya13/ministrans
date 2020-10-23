<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined :loading="!userName">
        <v-card-text>
          <v-flex class="mb-4">
            <v-dialog v-model="dialogAva" persistent max-width="320">
              <template v-slot:activator="{ on }">
                <v-avatar size="100" class="mr-4">
                  <v-img
                    v-if="!userImage"
                    src="../assets/user.png"
                    v-on="on"
                  ></v-img>
                  <v-img v-else :src="userImage" v-on="on"></v-img>
                </v-avatar>
              </template>
              <v-card>
                <v-card-title>Вы точно хотите поменять аватар?</v-card-title>
                <v-card-text>
                  <input type="file" @change="onFileChanged" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="dialogAva = false"
                    >Отмена</v-btn
                  >
                  <v-btn
                    color="primary"
                    @click.prevent="onUpload()"
                    :disabled="getProcessing"
                    >Подтвердить</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
          <h2 class="headline mb-0">
            <h4 v-if="!userName && !userSurname">
              <v-icon>person</v-icon> Нет данных
            </h4>
            <h4 v-if="userName && userSurname">
              <v-icon>person</v-icon> {{ userName }} {{ userSurname }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4><v-icon>email</v-icon> {{ userEmail }}</h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="!phone"><v-icon>phone</v-icon>Нет данных</h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="phone"><v-icon>phone</v-icon> {{ phone }}</h4>
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
          <v-btn :to="{ name: 'edit-profile', params: { tab: 1 } }"
            >Управление данными</v-btn
          >
        </v-card-actions>
      </v-card>
      <br />
      <schedule-for-users
        :hide-headers="true"
        :target-id="userId"
      ></schedule-for-users>
      <br />
      <last-day></last-day>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { mapGetters, mapMutations } from "vuex";
import lastDay from "../components/CheckInLastDays";
import ScheduleForUsers from "@/components/ScheduleForUsers";

export default {
  data() {
    return {
      dialogAva: false,
      valid: null,
      imageData: null,
      picture: null,
      uploadValue: null,
    };
  },
  computed: {
    ...mapGetters([
      "userId",
      "userName",
      "userClas",
      "userLevel",
      "userSurname",
      "userEmail",
      "getProcessing",
      "getError",
      "userBirthday",
      "userParafia",
      "phone",
    ]),
    userImage() {
      let image = this.$store.getters.url;
      return image;
    },
  },
  methods: {
    ...mapMutations(["SET_ERROR", "SET_MESSAGE"]),
    onFileChanged(event) {
      const file = event.target.files[0];
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = file;
      console.log(this.messagesRef);
    },
    onUpload() {
      this.picture = null;
      const storageRef = firebase
        .storage()
        .ref(`/${this.$store.getters.userId}/${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        "state_changed",
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
          this.SET_ERROR(error);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.picture = url;
            this.$store.dispatch("ADD_USER_IMG", { url: this.picture });
          });
        }
      ),
        (this.dialogAva = false);
    },
  },
  components: {
    lastDay,
    ScheduleForUsers,
  },
};
</script>

<style scoped>
img.preview {
  width: 20px;
}
</style>