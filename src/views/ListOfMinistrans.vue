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
                  <td>
                    <v-chip
                      v-if="stats[user.uid]"
                      :color="chipColorSunday(user.uid)"
                    >
                      {{ mySundays(user.uid) }}/{{ allSundays }}/{{
                        mySundays(user.uid / allSundays) * 100 + "%"
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
                        parseInt(myWeekdays(user.uid) / allWeekdays) * 100 + "%"
                      }}
                    </v-chip>
                    <v-chip v-else color="red">0</v-chip>
                  </td>
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
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {};
  },
  methods: {
    currentUser(uid) {
      this.$router.push({ name: "ministrant", params: { uid } });
    },
    mySundays(id) {
      return this.stats[id]
        ? this.stats[id].filter((x) => new Date(x.date).getDay() == 0).length
        : "";
    },
    myWeekdays(id) {
      return this.stats[id]
        ? this.stats[id].filter((x) => new Date(x.date).getDay() != 0).length
        : "";
    },
    chipColorSunday(id) {
      let color;
      if (
        this.allSundays >
        this.stats[id].filter((x) => new Date(x.date).getDay() == 0).length
      )
        color = "red";
      else {
        color = "green";
      }
      return color;
    },
    chipColorWeekday(id) {
      let color;
      if (
        this.allWeekdays >
        this.stats[id].filter((x) => new Date(x.date).getDay() != 0).length
      )
        color = "red";
      else {
        color = "green";
      }
      return color;
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
      let weekday = Math.floor(moment().diff("2020 10 25", "weeks") / 2);
      return weekday;
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