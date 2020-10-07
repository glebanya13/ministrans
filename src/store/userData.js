import Vue from 'vue'
import { EventBus } from '../infrastructure/eventBus'
import firebase from 'firebase'

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
        users: {},
        usersForTimeTable: []
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            Vue.set(state, 'userData', payload)
        },
        SET_USERS(state, payload) {
            state.users = payload
        },
        SET_USERS_FOR_TIMETABLE(state, users) {
            state.usersForTimeTable = users
        },
        UNSET_USER_DATA(state) {
            state.userData = defaultUserData
        }
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
                    EventBus.notify('user-data-loaded')
                })
                .catch(() => {
                    commit('SET_PROCESSING', false)
                })
        },
        ADD_USER_DATA({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('userData').doc(getters.userId)

            if (payload.name) {
                var user = firebase.auth().currentUser;

                user.updateProfile({
                    displayName: `${payload.name} ${payload.surname}`
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    commit('SET_ERROR', error.message)
                });
            }
            firebase.auth().currentUser

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
        LOAD_USERS({ commit }) {
            Vue.$db.collection('userData')
                .get()
                .then(querySnapshot => {
                    let users = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let user = {
                            uid: data.userId,
                            name: data.name
                        }
                        users.push(user)
                    })
                    commit('SET_USERS', users)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
                )
        },
        LOAD_USERS_FOR_TIMETABLE({ commit }) {
            commit('SET_PROCESSING', true)
            Vue.$db.collection('userData')
                .get()
                .then(querySnapshot => {
                    let users = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let user = {
                            uid: data.userId,
                            name: data.name,
                            surname: data.surname,
                            timetable: data.timetable || {
                                vs: "",
                                pn: "",
                                vt: "",
                                sr: "",
                                cht: "",
                                pt: "",
                                sb: "",
                            }
                        }
                        users.push(user)
                    })
                    commit('SET_USERS_FOR_TIMETABLE', users)
                    commit('SET_PROCESSING', false)
                })
                .catch(error => {
                    commit('SET_ERROR', error.message)
                    commit('SET_PROCESSING', false)
                })
        },
        UPDATE_TIMETABLE_FOR_USER({ commit }, user) {

            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('userData').doc(user.uid)
            userDataRef.set({
                timetable: user.timetable
            }, { merge: true })
                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch(() => {
                    commit('SET_PROCESSING', false)
                })
        }
    },

    getters: {
        users: (state) => state.users,
        userData: (state) => state.userData,
        userName: (state) => state.userData.name,
        userLevel: (state) => state.userData.level,
        userSurname: (state) => state.userData.surname,
        userBirthday: (state) => state.userData.birthday,
        userClas: (state) => state.userData.clas,
        userParafia: (state) => state.userData.parafia,
        usersForTimeTable: (state) => state.usersForTimeTable,
    }
}