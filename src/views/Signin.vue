<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">

        <div>
        <a @click="home()">
          <center><v-img src="../assets/bird.png" width="50px" class="bird"></v-img></center>
        </a>
        </div>

        <h1 class="text-center">Рады видеть Вас снова!</h1><br>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Вход</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
           <v-alert type="error" v-if="error">
              {{ error }}
            </v-alert>

            <v-form v-model="valid">
              <v-text-field
                label="Е-мейл"
                name="login"
                prepend-icon="mdi-email"
                type="email"
                required
                v-model="email"
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click.prevent="signin()"
              :disabled="processing || !valid"
              >Войти</v-btn
            >
          </v-card-actions>
        </v-card>
        <div class="text-center" v-if="socialEnabled">
          <br /><br />
          Или войти с помощью:  <br />
          <button class="social-button" @click="socialSignIn()">
            <img src="../assets/google-logo.png" alt="" />
          </button>
          <button class="social-button" @click="phone()">
            <img src="../assets/phone.png" alt="" />
          </button>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import { mapGetters } from "vuex";
import messages from '@/utils/messages.js'
export default {
  data() {
    return {
      socialEnabled: true,
      email: null,
      password: null,
      valid: false,
      emailRules: [
        (v) => !!v || "Пожалуйста введите е-мейл",
        (v) => /.+@.+\..+/.test(v) || "Неправильный е-мейл",
      ],
      passwordRules: [
        (v) => !!v || "Пожалуйста введите пароль",
        (v) =>
          (v && v.length >= 6) ||
          "Пароль слишком короткий - минимум 6 символов",
      ],
    };
  },
  computed: {
    //...mapGetters(['getError','getProcessing','isUserAuthenticated'])
    error() {
      let e = this.$store.getters.getError
      return e && (messages[e.code] || messages['default-error']);
    },
    processing() {
      return this.$store.getters.getProcessing;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    needProfile() {
      return this.$store.getters.needProfile;
    },
  },
  watch: {
    isUserAuthenticated(val) {
      if (val === true) {
      //    this.$router.push("/");
      }
    },
    needProfile(val) {
      if (val === true && this.isUserAuthenticated) {
        this.$router.push({name: "edit-profile", params:{tab:1}});
         // this.$router.push("/");
      }
    },
  },
  methods: {
    signin() {
      this.$store.dispatch("SIGNIN", {
        email: this.email,
        password: this.password,
      });
    },
    socialSignIn() {
      this.$store.dispatch("SOCIALSIGNIN");
    },
    home(){
      this.$router.push({ path: '/' })
    },
    phone(){
      this.$router.push({ path: '/loginPhone' })
    }
  },
  created() {
    this.$bus.$on("checked-if-need-profile", () => {
      if(!this.needProfile){
        this.$router.push("/profile");
      }
     // this.$router.push({name: "edit-profile", params:{tab:1}});
    });
  },
  beforeDestroy() {
    this.$bus.$off("checked-if-need-profile");
  },
};
</script>

<style scoped>
.social-button {
  width: 75px;
  background: white;
  padding: 10px;
  border-radius: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  outline: 0;
  border: 0;
}

.social-button:active {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.social-button img {
  width: 100%;
}

.bird{
  text-align: center;
}
</style>