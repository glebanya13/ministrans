<template>
  <v-container fluid>
    <v-layout column v-if="!targetId">
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
                    <v-img v-if="!userImage" src="../assets/5.png">
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
            <h4 v-if="!phone"><v-icon>phone</v-icon>Нет данных</h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="phone"><v-icon>phone</v-icon> <a :href="`tel:${this.phone}`" class="grey--text">{{phone}}</a></h4>
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
      <!-- <v-card>
        <sunday-schedule></sunday-schedule>
      </v-card> -->
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
    <v-layout column v-else>
      <v-card class="mx-auto" width="600" outlined :loading="!mName">
        <v-card-text>
          <v-flex class="mb-4">
            <v-avatar size="100" class="mr-4">
              <v-img v-if="!mUrl" src="../assets/5.png"> ></v-img>
              <v-img v-else :src="mUrl"></v-img>
            </v-avatar>
          </v-flex>
          <h2 class="headline mb-0">
            <h4 v-if="!mName && !mSurname">
              <v-icon>person</v-icon> Нет данных
            </h4>
            <h4 v-if="mName && mSurname">
              <v-icon>person</v-icon> {{ mName }} {{ mSurname }}
            </h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="!mPhone"><v-icon>phone</v-icon>Нет данных</h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="mPhone"><v-icon>phone</v-icon> <a :href="`tel:${this.mPhone}`" class="grey--text">{{mPhone}}</a></h4>
          </h2>

          <h2 class="headline mb-0">
            <h4 v-if="!mBirthday">
              <v-icon>mdi-calendar-today</v-icon> Нет данных
            </h4>
            <h4 v-if="mBirthday">
              <v-icon>mdi-calendar-today</v-icon>
              {{ mBirthday | moment("DD MMMM YYYY") }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!mClas"><v-icon>mdi-book-outline</v-icon> Нет данных</h4>
            <h4 v-if="mClas"><v-icon>mdi-book-outline</v-icon> {{ mClas }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!mLevel"><v-icon>mdi-star</v-icon> Нет данных</h4>
            <h4 v-if="mLevel"><v-icon>mdi-star</v-icon> {{ mLevel }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="!mParafia"><v-icon>mdi-church</v-icon> Нет данных</h4>
            <h4 v-if="mParafia"><v-icon>mdi-church</v-icon> {{ mParafia }}</h4>
          </h2>
        </v-card-text>
      </v-card>
      <!-- <v-card>
        <sunday-schedule></sunday-schedule>
      </v-card> -->
      <br />
      <schedule-for-users
        :hide-headers="true"
        :target-id="targetId"
      ></schedule-for-users>
      <br />
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab :key="'church'" ripple> Имша </v-tab>
        <v-tab :key="'meet'"> Встреча </v-tab>
        <v-tab-item :key="'church'">
          <last-day
            :tab="tab"
            :target-id="targetId"
            :disable-remove="true"
          ></last-day>
        </v-tab-item>
        <v-tab-item :key="'meet'">
          <last-day
            :tab="tab"
            :target-id="targetId"
            :disable-remove="true"
          ></last-day>
        </v-tab-item>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import lastDay from "../components/CheckInLastDays";
import ScheduleForUsers from "@/components/ScheduleForUsers";
// import SundaySC from "@/components/TodaySchedule";
import ImageUploader from "vue-image-upload-resize";

export default {
  props: ["targetId"],
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
      "getError",
      "userBirthday",
      "userParafia",
      "phone",
      "mName",
      "mLevel",
      "mSurname",
      "mBirthday",
      "mClas",
      "mParafia",
      "mPhone",
    ]),
    userImage() {
      let image = this.$store.getters.url;
      return image;
    },
    mUrl() {
      let image = this.$store.getters.mUrl;
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
    // TodaySchedule
  },
  created() {
    if (this.targetId) {
      this.$store.dispatch("LOAD_USER_DATA_BY_USER", this.targetId);
    }
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