<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <h1 class="text-center">Добро пожаловать!</h1>
        <br />
        <v-card class="elevation-12">
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step editable step="1"> Phone </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="2"> Code </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Password </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color="grey lighten-2" height="200px">
                  <v-card-text>
                    <h2>Введите Ваш номер телефона:</h2>
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
                  </v-card-text>
                </v-card>
                <v-btn
                  color="primary"
                  @click="sendOtp()"
                  id="sign-in-button"
                  :disabled="!valid"
                  class="float-right"
                >
                  Continue
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color="grey lighten-2" height="200px">
                  <v-card-text>
                    <div id="recaptcha-container"></div>
                    <v-form v-model="valid2">
                      <v-text-field
                        type="number"
                        v-model="otp"
                        placeholder="Код подтверждения"
                        :rules="optRules"
                      />
                    </v-form>
                    <br />
                    <p>Не пришел код?</p>
                    <a @click="sendOtp()">Повторить отправку?</a>
                  </v-card-text>
                </v-card>

                <v-btn
                  color="primary"
                  @click="verifyOtp()"
                  :disabled="!valid2"
                  class="float-right"
                >
                  Continue
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12" height="200px" color="grey lighten-2">
                  <v-card-text>
                    <v-form v-model="valid3">
                      <v-text-field
                        placeholder="Введите пароль"
                        v-model="password"
                        :rules="passwordRules"
                      ></v-text-field>
                      <v-text-field
                        placeholder="Подтвердите пароль"
                        v-model="password_2"
                        :rules="password2Rules"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-card>

                <v-btn
                  color="primary"
                  @click="setPassword()"
                  :disabled="!valid3"
                  class="float-right"
                >
                  Continue
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
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
      e1: 1,
      phNo: "",
      appVerifier: "",
      valid: null,
      valid2: null,
      valid3: null,
      password: "",
      password_2: "",
      otp: "",
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
      passwordRules: [(v) => !!v || "Пожалуйста введите ваш пароль"],
      password2Rules: [(v) => !!v || "Пожалуйста подтвердите пароль"],
      optRules: [(v) => !!v || "Пожалуйста введите ваш код"],
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
      this.e1 = 2;
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
      if (this.phNo.length != 12 || this.otp.length != 6) {
        alert("Неверный формат номера телефона / кода!");
      } else {
        var code = this.otp;

        var credential = firebase.auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
        this.e1 = 3;
      }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function () {},
          }
        );
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
    setPassword() {
      if (this.password != this.password_2) {
        alert("Пароли не совпадают");
      } else if (this.password.length != 6) {
        alert("Пароль слишком маленький! Длина пароля должна быть не менее 6!");
      } else {
        let vm = this;
        var user = firebase.auth().currentUser;

        let userPhone = firebase.auth().currentUser.phoneNumber;
        let newEmail = firebase.auth().currentUser.phoneNumber + "@site.com";
        let newPassword = this.password;
        //
        user
          .updateEmail(newEmail)
          .then(function () {
            user
              .updatePassword(newPassword)
              .then(function () {
                alert("Регистрация выполнена!");
                vm.$router.push({ name: "edit-profile", params: { tab: 1 } });
                vm.$store.dispatch("ADD_USER_PHONE", { phone: userPhone });
              })
              .catch(function (error) {
                alert("Error :" + error.message);
              });
          })
          .catch(function (error) {
            //Logout if session expires !
            if (error.code == "auth/requires-recent-login") {
              alert(
                "Срок действия вашего сеанса истек, чтобы установить пароль! Пожалуйста, попробуйте еще раз!"
              );
              //
              vm.signout();
            }
          });
      }
    },
    signout() {
      firebase.auth().signOut();
      this.$router.push({ path: "/" });
      window.location.reload(); //reload on signout !
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>