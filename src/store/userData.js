import Vue from 'vue'

let defaultUserData = {
        level: {},
        clas: {},
        birthday: {},
        surname: {},
        name: {}
}
export default {
    state: {
        userData: defaultUserData
    },
    mutations: {
        SET_USER_DATA(state, payload){
            Vue.set(state, 'userData', payload)
        },
    },
    actions:{
        LOAD_USER_DATA({commit}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
            .then((data) => {
                let userData = data.exists ? data.data() : defaultUserData

                if(!userData.level)
                    userData.level = {}


                commit('SET_USER_DATA', userData)
                commit('SET_PROCESSING', false)

            })
            .catch(() => {
                commit('SET_PROCESSING', false)
            })
        },
        ADD_USER_DATA({commit, getters}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            userDataRef.set({
                level: payload.level,
                birthday: payload.birthday,
                clas: payload.clas,
                name: payload.name,
                surname: payload.surname
            }, {merge: true})

            .then(() => {
                commit('SET_PROCESSING', false)
            })
            .catch(() => {
                commit('SET_PROCESSING', false)
            })
        }
    },
    getters:{
        
    }
}