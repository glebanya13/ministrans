import Vue from 'vue'

let defaultUserData = {
    level: null,
    clas: null,
    name: null,
    birthday: null,
    surname: null,
    parafia: null,
}
export default {
    state: {
        userData: defaultUserData,

    },
    mutations: {
        SET_USER_DATA(state, payload) {
            Vue.set(state, 'userData', payload)
        },
    },
    actions: {
        LOAD_USER_DATA({ commit }, payload) {
            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
                .then((data) => {
                    let userData = data.exists ? data.data() : defaultUserData

                    if (!userData)
                        userData = null

                    commit('SET_USER_DATA', userData)
                    commit('SET_PROCESSING', false)
                })
                .catch(() => {
                    commit('SET_PROCESSING', false)
                })
        },
        ADD_USER_DATA({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)

            userDataRef.set({
                level: payload.level,
                birthday: payload.birthday,
                clas: payload.clas,
                name: payload.name,
                surname: payload.surname,
                parafia: payload.parafia,
                userId: getters.userId
            }, { merge: true })

                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch(() => {
                    commit('SET_PROCESSING', false)
                })
        },
    },
    getters: {
        userData: (state) => state.userData,
        userName: (state) => state.userData.name,
        userLevel: (state) => state.userData.level,
        userSurname: (state) => state.userData.surname,
        userBirthday: (state) => state.userData.birthday,
        userClas: (state) => state.userData.clas,
        userParafia: (state) => state.userData.parafia,
    }
}