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
export default {
  data() {
    return {};
  },
  methods: {
    currentUser(uid) {
      this.$router.push({ name: "ministrant", params: { uid } });
    },
  },
  computed: {
    users() {
      return this.$store.getters.users && this.$store.getters.users.length > 0
        ? this.$store.getters.users.filter((u) => u.level != "Ксендз")
        : [];
    },
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