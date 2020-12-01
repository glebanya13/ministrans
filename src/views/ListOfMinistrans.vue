<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" width="1%"></th>
                  <th class="text-left">Имя Фамилия</th>
                  <th class="text-left">ВС</th>
                  <th class="text-left">Будний</th>
                  <th class="text-left">Профиль</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.uid" :user="user">
                  <td width="1%">
                    <v-avatar v-if="user.url"
                      ><v-img :src="user.url" class="ma-2"></v-img
                    ></v-avatar>
                    <v-avatar v-else
                      ><v-img src="../assets/user.png" class="ma-2"></v-img
                    ></v-avatar>
                  </td>
                  <td>{{ user.name }} {{ user.surname }}</td>
                    <td v-for="mark in test" :key="mark.date">{{mark.sunday}}</td>
                    <td v-for="mark in test" :key="mark.date">{{mark.weekDay}}</td>
                  
                  <td>
                    <button class="blue--text" @click="currentUser(user.uid)">
                      Перейти
                    </button>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-btn @click="cs()"></v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    currentUser(uid) {
      this.$router.push({ name: "ministrant", params: { uid } });
    },
    cs(item){
      console.log(item)
      console.dir(this.test)
    }
  },
  computed: {
    ...mapGetters(["stats", "userId"]),
    users() {
      return this.$store.getters.users && this.$store.getters.users.length > 0
        ? this.$store.getters.users.filter((u) => u.level != "Ксендз")
        : [];
    },
    test(){
      let sunday = this.stats[this.userId].filter(x => x.isSunday).length;
      let weekDay = this.stats[this.userId].filter(x => !x.isSunday).length;
      let currentUser = this.users.filter(x => x.uid == this.userId)
      let array = currentUser.concat({sunday: sunday,
      weekDay: weekDay})
      console.log(array)
      return array
    }
    // resSunday(){
    //   let resSunday = {};
    //   for (var k in this.stats) {
    //     resSunday = {
    //       name: `${this.stats[k][0].name} ${this.stats[k][0].surname}`
    //      }
    //   }
    //   return resSunday
    // },
    // userData(){
    //   this.users.forEach(element => {
        
    //   });
    // }
  },
  created(){
    this.$store.dispatch("LOAD_STATS");
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.v-data-table {
  line-height: 4 !important;
}
</style>