<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm-1>
        <v-tabs v-model="tab" centered>
          <v-tabs-slider></v-tabs-slider>
          <v-tab>Роли</v-tab>
          <v-tab>Чтото еще</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table
              :headers="headers"
              :items="userRolesData"
              class="elevation-1"
            >
              <template v-slot:item.role.admin="{ item }">
                <v-checkbox
                  v-model="item.role.admin"
                  @click="addUserToUpdate(item)"
                ></v-checkbox>
              </template>
              <template v-slot:item.role.priest="{ item }">
                <v-checkbox
                  v-model="item.role.priest"
                  @click="addUserToUpdate(item)"
                ></v-checkbox>
              </template>
              <template v-slot:item.role.senior="{ item }">
                <v-checkbox
                  v-model="item.role.senior"
                  @click="addUserToUpdate(item)"
                ></v-checkbox>
              </template>
            </v-data-table>
            <br />
            <div class="center">
              <v-btn
                class="primary"
                @click="updateRoles"
                :disabled="!enableUpdate"
                >Обновить базу данных</v-btn
              >
            </div>
          </v-tab-item>
          <v-tab-item> 
            <v-row>
              <v-col>
                <v-btn @click="setDefaultParish">Set default parish for all users</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="removeFieldSchedule">Remove SCHEDULE Field for all users</v-btn>
              </v-col>
            </v-row>
            
             </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//import helpers from "@/utils/helpers.js";

export default {
  data() {
    return {
      headers: [
        {
          text: "Имя",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Админ",
          sortable: false,
          value: "role.admin",
        },
        {
          text: "Ксенз",
          sortable: false,
          value: "role.priest",
        },
        {
          text: "Старший",
          sortable: false,
          value: "role.senior",
        },
      ],
      usersToUpdate: {},
      tab: null,
      roles: ["admin", "priest", "senior"],
      enableUpdate: false
    };
  },
  computed: {
    ...mapGetters[("users", "userRoles")],
    userRolesData() {
      let userRolesResult = [];
      let userRoles = this.$store.getters.userRoles.reduce(function (map, obj) {
        map[obj.uid] = obj;
        return map;
      }, {});

      if (this.$store.getters.users.length) {
        userRolesResult = this.$store.getters.users.map((u) => {
          let roleData = userRoles[u.uid];
          let emailData = roleData ? roleData.email : "Нет роли";
          let result = {
            uid: u.uid,
            role: roleData ? roleData.role : {},
            name: `${u.name} ${u.surname} (${emailData})`,
            email: emailData,
          };
          if (roleData) {
            userRoles[u.uid] = null;
          }
          return result;
        });
      }

      // add users without userDataRecord
      for (var key in userRoles) {
        if (userRoles[key]) {
          userRolesResult.push({
            uid: key,
            role: userRoles[key].role,
            name: `${"Нет данных"} (${userRoles[key].email})`,
            email: userRoles[key].email,
          });
        }
      }

      return userRolesResult;
    }
  },
  methods: {
    ...mapActions(["LOAD_USER_ROLES", "CHANGE_ROLES"]),
    addUserToUpdate(user) {
      this.usersToUpdate[user.uid] = user;
      this.enableUpdate = true;
    },
    updateRoles() {
      var result = [];
      for (var uid in this.usersToUpdate) {
        result.push({
          uid: uid,
          role: this.usersToUpdate[uid].role,
        });
      }
      if (result.length) {
        this.CHANGE_ROLES(result);
        this.usersToUpdate = [];
        this.enableUpdate = false
      }
    },
    // for migrations
    setDefaultParish(){
      let users = this.$store.getters.users
      if(users && users.length > 0){
        this.$store.dispatch('SET_DEFAULT_PARISH_FOR_USERS', users)
      }
    },
    removeFieldSchedule(){
      let users = this.$store.getters.users
      if(users && users.length > 0){
        this.$store.dispatch('REMOVE_FIELD_FOR_USERS', users)
      }
    }
  },
  created() {
    this.LOAD_USER_ROLES();
    this.$bus.$on("users-are-loaded", () => {
     // this.assignSchedule();
    });
  },
  beforeDestroy() {
    this.$bus.$off("users-are-loaded");
    //this.$bus.$off("parish-is-loaded");
  },
};
</script>

<style>
</style>