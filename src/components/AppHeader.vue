<template>
  <div>
    <v-navigation-drawer
      absolute
      temporary
      v-model="drawer"
      class="hidden-md-and-up"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="`navdrawer${i}`"
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item text style="cursor: pointer" v-if="isUserAuthenticated">
          <v-list-item-icon>
            <v-icon left>mdi-exit-run</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title @click.prevent="singout()"
              >Выйти</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>

      <router-link :to="{path: '/'}" tag="span" style="cursor: pointer">
        <v-toolbar-title>Ministrants</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="(item, i) in menuItems"
          text
          :key="`menuitem${i}`"
          :to="item.route"
        >
          <v-icon left v-html="item.icon"></v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn text @click.prevent="singout()" v-if="isUserAuthenticated">
          <v-icon left>mdi-exit-run</v-icon>
          Выйти
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    homeLink(){
      return `${this.$store.getters.isUserAuthenticated ? 'checkin' : '/'}`
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    menuItems() {
      return this.isUserAuthenticated
        ? [ 
          {
            title: "migration",
            route: '/migration'
          },
          {
              icon: "mdi-text-box-multiple-outline",
              title: "Admin",
              route: "/admin",
            },
            {
              icon: "mdi-text-box-multiple-outline",
              title: "Parish",
              route: "/parish",
            },
            {
              icon: "mdi-account-multiple",
              title: "Список министрантов",
              route: "/ministrans"
            },
            {
              icon: "mdi-account",
              title: "Профиль",
              route: "/profile",
            },
            {
              icon: "mdi-text-box-multiple-outline",
              title: "Расписание",
              route: "/schedule",
            },
            {
              icon: "mdi-list-status",
              title: "Посещение",
              route: "/stats",
            },
            {
              icon: "mdi-check-decagram",
              title: "Отметиться",
              route: "/checkin",
            },
          ]
        : [
            {
              icon: "mdi-lock-open",
              title: "Регистрация",
              route: "/signup",
            },
            {
              icon: "mdi-exit-to-app",
              title: "Войти",
              route: "/signin",
            },
          ];
    },
  },
  methods: {
    singout() {
      this.$confirm("Вы точно хотите выйти?").then((res) => {
        if (res) {
          this.$store.dispatch("SIGNOUT");
          this.$router.push({ name: "home" });
          //this.$router.push("/");
        }
      });
    },
  },
};
</script>

<style>
</style>