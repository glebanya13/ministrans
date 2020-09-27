import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebaseConfig from './config/firebase'
import firebase from 'firebase'
import 'firebase/firestore'
import VuetifyConfirm from 'vuetify-confirm'
import { setupBus } from './infrastructure/eventBus'

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Да',
  buttonFalseText: 'Нет',
  color: 'warning',
  icon: 'warning',
  title: 'Опасно',
  width: 350,
  property: '$confirm'
})

Vue.config.productionTip = false


const firebaseApp =  firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

Vue.$db = db

setupBus()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created(){
    // this.$store.dispatch("LOAD_MARKS")
  },
}).$mount('#app')
