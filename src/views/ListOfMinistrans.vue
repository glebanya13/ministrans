<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <!-- <v-data-table
            :headers="headers"
            :items="users ? users : []"
            class="elevation-1"
            :loading="!users"
            :loading-text="loadingText"
          >
            <template v-slot:item.url="{ item }">
              <v-avatar v-if="item.url"
                ><v-img :src="item.url" class="ma-2"></v-img
              ></v-avatar>
              <v-avatar v-else
                ><v-img src="../assets/user.png" class="ma-2"></v-img
              ></v-avatar>
            </template>
            <template v-slot:item.surname="{ item }">
              {{ item.name }} {{ item.surname }}
            </template>
            <template v-slot:item.clas="{ item }">
              <v-chip v-if="stats[item.uid]" :color="chipColorSunday(item.uid)">
                {{ mySundays(item.uid) }}/{{ allSundays }}/{{
                  (mySundays(item.uid) / allSundays) * 100 + "%"
                }}
              </v-chip>
              <v-chip v-else color="red">0</v-chip>
            </template>
            <template v-slot:item.level="{ item }">
              <v-chip
                v-if="stats[item.uid]"
                :color="chipColorWeekday(item.uid)"
              >
                {{ myWeekdays(item.uid) }}/{{ allWeekdays }}/{{
                  parseInt(myWeekdays(item.uid) / allWeekdays) * 100 + "%"
                }}
              </v-chip>
              <v-chip v-else color="red">0</v-chip>
            </template>
            <template v-slot:item.name="{ item }">
              <v-btn class="blue--text" @click="currentUser(item.uid)">
                Перейти
              </v-btn>
            </template>
          </v-data-table> -->

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
                  <td>
                    <v-chip
                      v-if="stats[user.uid]"
                      :color="chipColorSunday(user.uid)"
                    >
                      {{ mySundays(user.uid) }}/{{ allSundays }}/{{
                        Math.round(mySundays(user.uid) / allSundays * 100) + "%"
                      }}
                    </v-chip>
                    <v-chip v-else color="red">0</v-chip>
                  </td>
                  <td>
                    <v-chip
                      v-if="stats[user.uid]"
                      :color="chipColorWeekday(user.uid)"
                    >
                      {{ myWeekdays(user.uid) }}/{{ allWeekdays }}/{{
                        Math.round(myWeekdays(user.uid) / allWeekdays * 100) + "%"
                      }}
                    </v-chip>
                    <v-chip v-else color="red">0</v-chip>
                  </td>
                  <td>
                    <v-btn class="blue--text" text @click="currentUser(user.uid)">
                      Перейти
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      // headers: [
      //   {
      //     text: "",
      //     align: "start",
      //     value: "url",
      //   },
      //   {
      //     text: "Имя Фамилия",
      //     align: "start",
      //     value: "surname",
      //   },
      //   {
      //     text: "Вс",
      //     align: "start",
      //     value: "clas",
      //   },
      //   {
      //     text: "Будний",
      //     align: "start",
      //     value: "level",
      //   },
      //   {
      //     text: "Профиль",
      //     align: "start",
      //     value: "name",
      //   },
      // ],
      // loading: true,
      // loadingText: "Загрузка данных",
    };
  },
  methods: {
    currentUser(uid) {
      this.$router.push({ name: "ministrant", params: { uid } });
    },
    mySundays(id) {
      let startDate = moment("2020-10-24")
      return this.stats[id]
        ? this.stats[id].filter((x) => 
        startDate.isBefore(moment(x.date)) && // todo: refactoring
        new Date(x.date).getDay() == 0).length
        : "";
    },
    myWeekdays(id) {
      let startDate = moment("2020-10-24")
      return this.stats[id]
        ? this.stats[id].filter((x) => 
        startDate.isBefore(moment(x.date)) && // todo: refactoring
        new Date(x.date).getDay() != 0).length
        : "";
    },
    chipColorSunday(id) {
      let countOfCheckins = this.stats[id].filter(
        (x) => new Date(x.date).getDay() == 0
      ).length;
      return Math.round(this.allSundays * 0.9) > countOfCheckins ? "red" : "green";
    },
    chipColorWeekday(id) {
      let countOfCheckins = this.stats[id].filter(
        (x) => new Date(x.date).getDay() != 0
      ).length;
      return Math.round(this.allWeekdays / 2) > countOfCheckins
        ? "red"
        : "green";
    },
  },
  computed: {
    ...mapGetters(["stats"]),
    users() {
      return this.$store.getters.users && this.$store.getters.users.length > 0
        ? this.$store.getters.users.filter((u) => u.level != "Ксендз")
        : [];
    },
    allSundays() {
      var start = moment("2020-10-25"), // start
        end = moment(), // now
        day = 0; // Sunday

      var result = [];
      var current = start.clone();

      while (current.day(7 + day).isBefore(end)) {
        result.push(current.clone());
      }

      return result.length;
    },
    allWeekdays() {
      return moment().diff("2020 10 25", "weeks");
    },
  },
  created() {
    this.$store.dispatch("LOAD_STATS");
  },
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