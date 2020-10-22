<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <user-profile-data></user-profile-data>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import userProfileData from "../components/UserProfileData";
export default {
  computed:mapGetters(['userId']),
  components: {
    userProfileData
  },
};
</script>

<style>
</style>