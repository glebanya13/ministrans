import Vue from 'vue'
import Vuex from 'vuex'
import userModule from '../store/user'
import generalModule from '../store/general'
import userDataModule from '../store/userData'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userModule,
    generalModule,
    userDataModule,
  }
})
