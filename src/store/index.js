import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user'
import generalModule from './modules/general'
import userDataModule from './modules/userData'
import checkinsModule from './modules/checkins'
import loadDataModule from './modules/loadData'
import adminModule from './modules/admin'
import parishModule from './modules/parish'
import newsModule from './modules/news'
import ministrantsModule from './modules/ministrants'


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userModule,
    generalModule,
    userDataModule,
    checkinsModule,
    loadDataModule,
    adminModule,
    parishModule,
    newsModule,
    ministrantsModule
  }
})
