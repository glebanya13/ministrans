import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user'
import generalModule from './modules/general'
import userDataModule from './modules/userData'
import checkinsModule from './modules/checkins'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userModule,
    generalModule,
    userDataModule,
    checkinsModule,
  }
})
