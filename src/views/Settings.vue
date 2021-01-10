<template>
  <v-container>
    <v-flex>
      <v-card class="mx-auto mt-16 elevation-12" width="800px">
        <v-card-title>
          <h3 class="mt-2"><v-icon>settings</v-icon> System Settings</h3>
        </v-card-title>
        <v-card-text>
          <hr class="primary mt-2" />

          <v-list class="mt-2">
            <v-list-item>
              <v-col>
                <h1>Тема</h1>
              </v-col>
              <v-col>
                <v-switch
                  class="float-right"
                  v-model="theme"
                  inset
                  persistent-hint
                ></v-switch>
              </v-col>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="switchTheme()" class="mt-5">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      theme: false,
    };
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;

      localStorage.setItem(
        "theme",
        this.$vuetify.theme.dark ? "dark" : "light"
      );
    },
  },
  mounted() {
    if (localStorage.theme) {
      if (localStorage.theme === "dark") {
        this.theme = true;
      } else {
        this.theme = false;
      }
    }
  },
};
</script>

<style>
</style>