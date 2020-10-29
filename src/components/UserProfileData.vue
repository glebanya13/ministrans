<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined :loading="!userName">
        <v-card-text>
          <v-flex class="mb-4">
            <image-uploader
              :debug="1"
              :maxWidth="512"
              :quality="0.7"
              :autoRotate="true"
              outputFormat="file"
              :preview="false"
              :className="['fileinput', { 'fileinput--loaded': hasImage }]"
              :capture="false"
              accept="video/*,image/*"
              doNotResize="gif"
              @input="setImage"
            >
              <label for="fileInput" slot="upload-label">
                <figure>
                  <v-avatar size="100" class="mr-4">
                    <v-img v-if="!userImage" src="../assets/user.png">
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                        v-if="loading"
                      >
                        <v-progress-circular
                          class="text-center"
                          indeterminate
                          color="primary"
                        ></v-progress-circular> </v-row
                    ></v-img>
                    <v-img v-else :src="userImage">
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                        v-if="loading"
                      >
                        <v-progress-circular
                          class="text-center"
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-row>
                    </v-img>
                  </v-avatar>
                </figure>
              </label>
            </image-uploader>
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
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab :key="'church'" ripple> Имша </v-tab>
        <v-tab :key="'meet'"> Встреча </v-tab>
        <v-tab-item :key="'church'">
          <last-day :tab="tab"></last-day>
        </v-tab-item>
        <v-tab-item :key="'meet'">
          <last-day :tab="tab"></last-day>
        </v-tab-item>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import lastDay from "../components/CheckInLastDays";
import ScheduleForUsers from "@/components/ScheduleForUsers";
import ImageUploader from "vue-image-upload-resize";

export default {
  data() {
    return {
      valid: null,
      tab: "church",
      image: null,
      hasImage: false,
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
      "getError",
      "userBirthday",
      "userParafia",
      "phone",
    ]),
    userImage() {
      let image = this.$store.getters.url;
      return image;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  methods: {
    ...mapMutations(["SET_ERROR", "SET_MESSAGE"]),
    setImage: function (output) {
      this.hasImage = true;
      let img = output;
      this.image = img;
      this.$store.dispatch("ADD_USER_IMAGE", {
        url: this.image,
      });
    },
  },
  components: {
    lastDay,
    ScheduleForUsers,
    ImageUploader,
  },
};
</script>

<style>
#fileInput {
  display: none;
}
img.preview {
  width: 20px;
}
</style>