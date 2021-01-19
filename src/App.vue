<template>
  <v-app>
    <app-header></app-header>
    <v-main>
      <router-view></router-view>
    </v-main>
    <app-footer></app-footer>
    <v-snackbar v-model="snackbar" :vertical="vertical">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="addToLocalStorage()">
          Подтвердить
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { mapGetters } from "vuex";

export default {
  name: "App",

  components: {
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapGetters(["userData", "userId"]),
  },
  data: () => ({
    snackbar: false,
    text: "",
    vertical: true,
  }),
  created() {
    if (!localStorage.userdata) {
      if (this.userId != null) {
        this.$store.dispatch("LOAD_USER_DATA", this.userId);
        localStorage.setItem("userdata", JSON.stringify(this.userData));
      } else {
        this.snackbar = true;
        this.text = "Для улучшения приложения нажмите на кнопку";
      }
    } else {
      console.log("error");
    }
  },
  methods: {
    addToLocalStorage() {
      this.$store.dispatch("LOAD_USER_DATA", this.userId);
      localStorage.setItem("userdata", JSON.stringify(this.userData));
      this.snackbar = false;
    },
  },
};
</script>
