<template>
  <div>
    <h2>Настройки</h2>

    <p class="mt-4">Выберите тему:</p>
    <v-list>
      <v-list-item>
        <v-switch
        v-model="theme"
        inset
        label="Vuetify Theme Dark"
        persistent-hint
      ></v-switch>
      </v-list-item>
      <v-list-item>

      </v-list-item>
    </v-list>

    <v-btn @click="addSettingsToStorage()" class="mt-5">Готово</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: false
    };
  },
  methods: {
    addSettingsToStorage() {
      this.$vuetify.theme.dark = this.theme
      localStorage.setItem("vuetify@user", `${JSON.stringify({"theme":{"dark":this.theme}})}`)
    },
  },
  // mounted() {
  //   if (localStorage.themeCache) {
  //     this.themeCache = localStorage.themeCache;
  //   }
  // },
};
</script>

<style>
</style>