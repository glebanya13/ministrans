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
            <h4 v-if="userName && userSurname">
              <v-icon>person</v-icon> {{ userName }} {{ userSurname }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="phone"><v-icon>phone</v-icon> {{ phone }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="userBirthday">
              <v-icon>mdi-calendar-today</v-icon>
              {{ userBirthday | moment("DD MMMM YYYY") }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="userClas">
              <v-icon>mdi-book-outline</v-icon> {{ userClas }}
            </h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="userLevel"><v-icon>mdi-star</v-icon> {{ userLevel }}</h4>
          </h2>
          <h2 class="headline mb-0">
            <h4 v-if="userParafia">
              <v-icon>mdi-church</v-icon> {{ userParafia }}
            </h4>
          </h2>
        </v-card-text>
      </v-card>
      <br />
      <last-day :target-id="currentId" :disable-remove="true"></last-day>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import lastDay from "../components/CheckInLastDays";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "userData",
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
    currentId(){
      return this.$route.params.uid
    }
  },
  methods: {},
  created() {
    this.$store.dispatch("LOAD_USER_DATA", this.$route.params.uid);
  },
  components: {
    lastDay,
  },
};
</script>