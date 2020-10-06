<template>
  <div>
    <v-navigation-drawer absolute temporary v-model="drawer" class="hidden-md-and-up">
      <v-list>
        <v-list-item v-for="(item, i) in menuItems" :key="`navdrawer${i}`" :to="item.route">
          <v-list-item-icon>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title text @click.prevent="singout()" v-if="isUserAuthenticated"><v-icon left>mdi-exit-run</v-icon> Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>

      <router-link to="/" tag="span" style="cursor:pointer">
        <v-toolbar-title>Ministrans</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="(item, i) in menuItems" text :key="`menuitem${i}`" :to="item.route">
          <v-icon left v-html="item.icon"></v-icon>
          {{item.title}}
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
    }
  },
  computed:{
    isUserAuthenticated(){
      return this.$store.getters.isUserAuthenticated
    },
      menuItems(){
          return this.isUserAuthenticated 
          ? [
            {
              icon: "mdi-account",
              title: "Профиль",
              route: "/profile",
            },
            {
              icon: "mdi-text-box-multiple-outline",
              title: "Расписание",
              route: "/timetable",
            },
             {
              icon: "mdi-text-box-multiple-outline",
              title: "Посещение",
              route: "/stats",
            },
            {
              icon: "mdi-check-decagram",
              title: "Отметиться",
              route: "/write",
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
          ]
      }
  }, 
  methods:{
    singout(){
      this.$confirm('Вы точно хотите выйти?').then(res => {
        if(res)
        this.$store.dispatch('SIGNOUT')
        this.$router.push({name: 'home'})
      })
    }
  }
}
</script>

<style>

</style>