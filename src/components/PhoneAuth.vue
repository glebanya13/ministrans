<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <!-- <div>
          
        </div> -->
        <h1 class="text-center">Добро пожаловать!</h1>
        <br />
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Регистрация</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert type="error" v-if="error">{{ error }}</v-alert>

            <v-form v-model="valid">
              <v-text-field
                prepend-icon="phone"
                type="text"
                required
                v-model="phNo"
                placeholder="+375*********"
                :rules="phoneRules"
              ></v-text-field>
            </v-form>
            <v-btn
              class="green white--text"
              text
              id="sign-in-button"
              @click="sendOtp"
              >Получить код</v-btn
            >
            <div id="recaptcha-container"></div>
            <br />
            <v-text-field
              type="number"
              v-model="otp"
              placeholder="Код подтверждения"
            />
            <v-btn class="green white--text" @click="verifyOtp"
              >Подтвердить</v-btn
            ><br /><br />
            <v-btn class="primary" @click="sendOtp()"
              >Повторить отправку?</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
import messages from "@/utils/messages.js";

export default {
  data() {
    return {
      phNo: "",
      appVerifier: "",
      valid: null,
      otp: "",
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
    };
  },
  computed: {
    error() {
      let e = this.$store.getters.getError;
      return e && (messages[e.code] || messages["default-error"]);
    },
  },
  methods: {
    sendOtp() {
      var phoneNumber = this.phNo;
      var appVerifier = window.recaptchaVerifier;

      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //
    verifyOtp() {
      if (this.phNo.length != 13 || this.otp.length != 6) {
        alert("Неверный формат номера телефона / кода!");
      } else {
        let vm = this
        var code = this.otp;
        console.log(code);

        var credential = firebase.auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
        vm.$router.push({path:'/setPassword'})
      }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "normal",
            callback: function () {},
            "expired-callback": function () {},
          }
        );
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>