import Vue from 'vue'

let defaultUserData = {
    user: {
        level: {},
        clas: {},
        birthday: {},
        surname: {},
        name: {},
        date: {
            day: {},
            time: {}
        }
    },
}
export default {
    state: {
        userData: defaultUserData
    },
    mutations: {
        SET_USER_DATA(state, payload){
            Vue.set(state, 'userData', payload)
        },
        // CHECKIN(state, payload){
        //     Vue.set(state.userData.user.date, payload.day, {checkIn: payload.timestamp})
        // }
    },
    actions:{
        LOAD_USER_DATA({commit}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
            .then((data) => {
                let userData = data.exists ? data.data() : defaultUserData
                
                if(!userData.user)
                    userData.user = {}

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
        },
        CHECK_IN({commit, getters}, payload){
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)
            let timestamp = payload.time

            userDataRef.update({
                [`date.${payload.day}.checkIn`] : timestamp,
            })
            // .then(() => commit('CHECKIN', {day: payload.day, timestamp: timestamp}))
        }
    },
    getters:{
        userData: (state) => state.userData
    }
}