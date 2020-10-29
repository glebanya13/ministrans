<template>
  <v-container fluid>
    <v-layout column>
      <v-card class="mx-auto" width="600" outlined>
        <v-card-text>
          <v-avatar size="100" class="mr-4">
            <v-img v-if="!userImage" src="../assets/user.png"></v-img>
            <v-img v-else :src="userImage"></v-img>
          </v-avatar>
          <h2 class="headline mb-0">
            <h4 v-if="mName && mSurname">
              <v-icon>person</v-icon> {{ mName }} {{ mSurname }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="mPhone"><v-icon>phone</v-icon> {{ mPhone }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="mBirthday">
              <v-icon>mdi-calendar-today</v-icon>
              {{ mBirthday | moment("DD MMMM YYYY") }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="mClas">
              <v-icon>mdi-book-outline</v-icon> {{ mClas }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="mLevel"><v-icon>mdi-star</v-icon> {{ mLevel }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="mParafia">
              <v-icon>mdi-church</v-icon> {{ mParafia }}
            </h4>
          </h2>
        </v-card-text>
      </v-card>
      <br />
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab :key="'church'" ripple> Имша </v-tab>
        <v-tab :key="'meet'"> Встреча </v-tab>
        <v-tab-item :key="'church'">
          <last-day
            :target-id="currentId"
            :tab="tab"
            :disable-remove="true"
          ></last-day>
        </v-tab-item>
        <v-tab-item :key="'meet'">
          <last-day
            :target-id="currentId"
            :tab="tab"
            :disable-remove="true"
          ></last-day>
        </v-tab-item>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import lastDay from "../components/CheckInLastDays";
export default {
  data() {
    return {
      tab: "church",
    };
  },
  computed: {
    ...mapGetters([
        "mName",
        "mLevel",
        "mSurname",
        "mBirthday",
        "mClas",
        "mParafia",
        "mUrl",
        "mPhone"
    ]),
    userImage() {
      let image = this.$store.getters.mUrl;
      return image;
    },
    currentId() {
      return this.$route.params.uid;
    },
  },
  methods: {},
  created() {
    this.$store.dispatch("LOAD_USER_DATA_BY_USER", this.$route.params.uid);
  },
  components: {
    lastDay,
  },
};
</script>