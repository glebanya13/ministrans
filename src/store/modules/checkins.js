import Vue from 'vue'
import helpers from '@/utils/helpers.js'

export default {
    state: {
        userMassCheckins: {},
        massCheckins: {},
        dateCheckins: null,
        stats: {}
    },
    mutations: {
        SET_USER_MASS_CHECKINS(state, payload) {
            state.userMassCheckins = payload
        },
        SET_MASS_CHECKINS(state, payload) {
            state.massCheckins = payload
        },
        SET_MASS_CHECKINS_BY_DATE(state, payload) {
            state.dateCheckins = payload
        },
        SET_STATS(state, payload) {
            state.stats = payload
        }
    },
    actions: {
        CHECK_IN({ commit, getters }, userCheckinData) {
            commit('SET_PROCESSING', true)

            let checkinRef = Vue.$db.collection('massCheckins').doc(`${userCheckinData.date}_${userCheckinData.time}_${getters.userId}`)

            checkinRef.set({
                date: userCheckinData.date,
                isSunday: userCheckinData.isSunday,
                parafia: {
                    parafiaName: getters.userParafia,
                },
                time: userCheckinData.time,
                user: {
                    name: getters.userName,
                    surname: getters.userSurname,
                    uid: getters.userId
                }
            }, { merge: true })
                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch((error) => {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        LOAD_MASS_CHECKINS_BY_USER({ commit, getters }) {
            Vue.$db.collection('massCheckins').where('user.uid', '==', getters.userId).limit(10)
                .get()
                .then(querySnapshot => {
                    let userCheckins = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let userCheckin = {
                            id: s.id,
                            time: data.time,
                            date: data.date,
                            uid: data.user.uid,
                            name: data.user.name,
                            surname: data.user.surname
                        }
                        userCheckins.push(userCheckin)
                    })
                    commit('SET_USER_MASS_CHECKINS', userCheckins)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        LOAD_MASS_CHECKINS({ commit }) {
            Vue.$db.collection('massCheckins')
                .get()
                .then(querySnapshot => {
                    let checkins = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        const user = data.user || {}
                        let checkin = {
                            uid: user.uid,
                            date: data.date,
                            name: user.name,
                            surname: user.surname,
                            isSunday: data.isSunday,
                            time: data.time
                        }
                        checkins.push(checkin)
                    })
                    commit('SET_MASS_CHECKINS', checkins)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                }
                )
        },
        LOAD_MASS_CHECKINS_BY_DATE({ commit }, date) {
            Vue.$db.collection('massCheckins')
                .where('date', '==', date)
                .get()
                .then(querySnapshot => {
                    let checkins = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        const user = data.user || {}
                        let checkin = {
                            uid: user.uid,
                            date: data.date,
                            name: user.name,
                            surname: user.surname,
                            isSunday: data.isSunday,
                            time: data.time
                        }
                        checkins.push(checkin)
                    })
                    commit('SET_MASS_CHECKINS_BY_DATE', checkins)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                }
                )
        },
        LOAD_STATS({ commit }) {
            Vue.$db.collection('massCheckins')
                .get()
                .then(querySnapshot => {
                    let checkins = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let checkin = {
                            uid: data.user.uid,
                            date: data.date,
                            name: data.user.name,
                            surname: data.user.surname,
                            isSunday: data.isSunday
                        }
                        checkins.push(checkin)
                    })
                    var res = helpers.groupByKey(checkins, 'uid')
                    commit('SET_STATS', res)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                }
                )
        }
    },

    getters: {
        userMassCheckins: (state) => state.userMassCheckins,
        massCheckins: (state) => state.massCheckins,
        stats: (state) => state.stats,
        dateCheckins: s => s.dateCheckins
    }

}


