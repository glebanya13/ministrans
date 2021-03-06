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
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import ImageUploader from 'vue-image-upload-resize'
Vue.use(ImageUploader);

const moment = require('moment')
require('moment/locale/ru')

Vue.use(require('vue-moment'), {
    moment
})

Vue.use(Chartkick.use(Chart))
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
  },
}).$mount('#app')
