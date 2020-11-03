<template>
  <v-flex>
    <v-tabs v-model="tab" grow color="primary" show-arrows>
      <v-tab key="0" v-if="credential != 'google.com'"> Вход </v-tab>
      <v-tab key="1"> Профиль </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-if="credential != 'google.com'">
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
import firebase from 'firebase'
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
  computed:{
    credential(){
      let user = firebase.auth().currentUser
      let id = user.providerData.map(d => d.providerId).toString()
      return id
    }
  },
  mounted(){
    this.tab = this.$route.params.tab
  }
};
</script>
<style>
</style>