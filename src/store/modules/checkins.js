import Vue from 'vue'
import helpers from '@/utils/helpers.js'
import { EventBus } from '../../infrastructure/eventBus';

export default {
    state: {
        userMassCheckins: [],
        userMeetingCheckins: [],
        massCheckins: {},
        dateCheckins: null,
        stats: {},
        meetingStats: {}
    },
    mutations: {
        SET_USER_MASS_CHECKINS(state, payload) {
            state.userMassCheckins = payload
        },
        SET_USER_MEETING_CHECKINS(state, payload) {
            state.userMeetingCheckins = payload
        },
        SET_MASS_CHECKINS(state, payload) {
            state.massCheckins = payload
        },
        SET_MASS_CHECKINS_BY_DATE(state, payload) {
            state.dateCheckins = payload
        },
        SET_STATS(state, payload) {
            state.stats = payload
        },
        SET_MEETING_STATS(state, payload){
            state.meetingStats = payload
        }
    },
    actions: {
        CHECK_IN({ commit, getters }, userCheckinData) {
            commit('SET_PROCESSING', true)

            let checkinRef

            if (userCheckinData.tab == '0') {
                checkinRef = Vue.$db.collection('massCheckins').doc(`${userCheckinData.date}_${userCheckinData.time}_${getters.userId}`)
            } else {
                checkinRef = Vue.$db.collection('meetingCheckins').doc(`${userCheckinData.date}_${userCheckinData.time}_${getters.userId}`)
            }

            checkinRef.set({
                date: userCheckinData.date,
                isSunday: userCheckinData.isSunday,
                isMeeting: userCheckinData.isMeeting,
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
        LOAD_MASS_CHECKINS_BY_USER({ commit, getters }, uid, limit = 1000) {
            let loadRef
            console.log(uid.tab)
            if (uid.tab == '0') {
                loadRef = Vue.$db.collection('massCheckins').where('user.uid', '==', uid.uid || getters.userId).limit(limit)
            }
            if (uid.tab == '1') {
                loadRef = Vue.$db.collection('meetingCheckins').where('user.uid', '==', uid.uid || getters.userId).limit(limit)
            }
            loadRef.get()
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
                    EventBus.notify('mass-checkins-for-user-are-loaded')
                    if (uid.tab == '0') {
                        commit('SET_USER_MASS_CHECKINS', userCheckins)
                    }
                    if (uid.tab == '1') {
                        commit('SET_USER_MEETING_CHECKINS', userCheckins)
                    }
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
                Vue.$db.collection('meetingCheckins')
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
                            isMeeting: data.isMeeting
                        }
                        checkins.push(checkin)
                    })
                    var res = helpers.groupByKey(checkins, 'uid')
                    commit('SET_MEETING_STATS', res)
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
        userMeetingCheckins: (state) => state.userMeetingCheckins,
        massCheckins: (state) => state.massCheckins,
        stats: (state) => state.stats,
        meetingStats: (state) => state.meetingStats,
        dateCheckins: s => s.dateCheckins
    }

}


