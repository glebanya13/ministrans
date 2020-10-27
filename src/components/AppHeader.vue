<template>
  <div>
    <v-navigation-drawer fixed temporary v-model="drawer">
      <v-layout column align-center v-if="isUserAuthenticated">
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img v-if="!userImage" src="../assets/user.png" alt="" />
            <v-img v-else :src="userImage"></v-img>
          </v-avatar>
          <p class="subheading mt-1 text-center">
            {{ userName }}
          </p>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-group
          v-if="isAdmin && isUserAuthenticated"
          :value="false"
          no-action
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="link in admins"
            :key="link.title"
            router
            :to="link.route"
          >
            <v-list-item-title>{{ link.title }}</v-list-item-title>

            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-for="link in users"
          :key="link.title"
          router
          :to="link.route"
        >
          <v-list-item-icon>
            <v-icon v-html="link.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="link.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-if="isUserAuthenticated"
          :value="false"
          no-action
          prepend-icon="mdi-pencil"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Отметка</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="link in marks"
            :key="link.title"
            router
            :to="link.route"
          >
            <v-list-item-title>{{ link.title }}</v-list-item-title>

            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <router-link :to="{ path: homeLink }" tag="span" style="cursor: pointer">
        <v-toolbar-title>Ministrants.site</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-toolbar-items>
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
    homeLink() {
      return `${this.$store.getters.isUserAuthenticated ? "checkin" : "/"}`;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isPriest() {
      return this.$store.getters.isPriest;
    },
    isSenior() {
      return this.$store.getters.isSenior;
    },
    users() {
      let links = [
        { icon: "face", title: "Регистрация", route: "/signup" },
        { icon: "mdi-lock-open", title: "Вход", route: "/signin" },
      ];
      if (this.isUserAuthenticated)
        links = [
          { icon: "mdi-account", title: "Профиль", route: "/profile" },
          {
            icon: "mdi-account-multiple",
            title: "Список министрантов",
            route: "/ministrans",
          },
        ];
      return links;
    },
    admins() {
      let links = [
        {
          icon: "mdi-text-box-multiple-outline",
          title: "AddNews",
          route: "/addnews",
        },
        {
          icon: "mdi-text-box-multiple-outline",
          title: "Admin",
          route: "/admin",
        },
        {
          icon: "mdi-text-box-multiple-outline",
          title: "Migration",
          route: "/migration",
        },
        {
          icon: "mdi-text-box-multiple-outline",
          title: "Parish",
          route: "/parish",
        },
      ];
      return links;
    },
    marks() {
      let links = [
        {
          icon: "mdi-text-box-multiple-outline",
          title: "Расписание",
          route: "/timetable",
        },
        {
          icon: "mdi-text-box-multiple-outline",
          title: "Кто сегодня?",
          route: "/schedule",
        },
        { icon: "mdi-list-status", title: "Посещение", route: "/stats" },
        { icon: "mdi-check-decagram", title: "Отметиться", route: "/checkin" },
      ];
      return links;
    },
    userImage() {
      let image = this.$store.getters.url;
      return image;
    },
    userName() {
      let name = this.$store.getters.userName;
      let surname = this.$store.getters.userSurname;
      let full = name + " " + surname;
      return full;
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

<style scoped>
</style>