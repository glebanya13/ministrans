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
            <v-toolbar-title>Пароль</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
              placeholder="Введите пароль"
              v-model="password"
              ></v-text-field>
              <v-text-field
              placeholder="Подтвердите пароль"
              v-model="password_2"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="setPassword">Подтвердить</v-btn>
          </v-card-actions>
        </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import firebase from 'firebase'
  export default {
    data(){
      return {
        password : '',
        password_2 : '',
        valid: null

      }
    },
    methods:{
      setPassword(){
        if(this.password != this.password_2){
          alert('Пароли не совпадают')
        }else if(this.password.length != 6){
          alert('Пароль слишком маленький! Длина пароля должна быть не менее 6!')
        }else{
          let vm = this
          var user = firebase.auth().currentUser;
          //
          let newEmail = firebase.auth().currentUser.phoneNumber + '@site.com'
          let newPassword = this.password
          //
          user.updateEmail(newEmail).then(function() {
            user.updatePassword(newPassword).then(function() {
              alert('Регистрация выполнена!')
              vm.$router.push('/')  //route to app home !
            }).catch(function(error) {
              alert('Error :' + error.message)
            });
          }).catch(function(error) {
            //Logout if session expires !
            if(error.code == 'auth/requires-recent-login'){
              alert("Срок действия вашего сеанса истек, чтобы установить пароль! Пожалуйста, попробуйте еще раз!")
              //
              vm.signout()
            }
          });
        }
      },
      signout(){
        firebase.auth().signOut();
        this.$router.push({path:'/'})
        window.location.reload();  //reload on signout !
      }
    }
  }
</script>