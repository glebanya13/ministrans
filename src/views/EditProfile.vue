<template>
  <v-flex>
    <v-tabs v-model="tab" grow color="primary" show-arrows>
      <v-tab key="0"> Вход </v-tab>
      <v-tab key="1"> Профиль </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card>
          <v-card-text>
            <user-login-data-edit> </user-login-data-edit>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <user-profile-edit></user-profile-edit>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-flex>
</template>


<script>
import UserProfileEdit from "../components/UserProfileEdit";
import UserLoginDataEdit from "../components/UserLoginDataEdit";
export default {
  data(){
    return{
      tab: 1
    }
  },
  components: {
    UserProfileEdit,
    UserLoginDataEdit,
  },
  mounted(){
    this.tab = this.$route.params.tab
  }
};
</script>
<style>
</style>