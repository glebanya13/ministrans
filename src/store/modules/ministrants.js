import Vue from 'vue'
import { EventBus } from '../../infrastructure/eventBus';

let defaultUserDataById = {
    level: null,
    clas: null,
    name: null,
    birthday: null,
    surname: null,
    parish: {},
    url: null,
    phone: null
};
export default {
    state: {
        userDataById: defaultUserDataById,
    },
    mutations: {
        SET_USER_DATA_BY_ID(state, payload) {
            Vue.set(state, 'userDataById', payload)
        },
    },
    actions: {
        LOAD_USER_DATA_BY_USER({ commit, dispatch }, uid) {
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(uid)
            userDataRef.get()
                .then((data) => {
                    let userDataById = defaultUserDataById
                    if (data.exists) {
                        userDataById = data.data();
                    }

                    if (userDataById.parish && userDataById.parish.id) {
                        dispatch('LOAD_PARISH', userDataById.parish.id)
                    }
                    commit('SET_USER_DATA_BY_ID', userDataById)
                    commit('SET_PROCESSING', false)
                    EventBus.notify('user-data-loaded')
                })
                .catch(error => {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
    },
    getters: {
        mName: (state) => state.userDataById.name,
        mLevel: (state) => state.userDataById.level,
        mSurname: (state) => state.userDataById.surname,
        mBirthday: (state) => state.userDataById.birthday,
        mClas: (state) => state.userDataById.clas,
        mParafia: (state) => state.userDataById.parish ? state.userDataById.parish.name : '',
        mUrl: (s) => s.userDataById.url,
        mPhone: (s) => s.userDataById.phone
    }
}