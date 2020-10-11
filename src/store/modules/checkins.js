import Vue from 'vue'

export default {
    state: {
        userMassCheckins: {},
        massCheckins: {},
        stats: {}
    },
    mutations: {
        SET_USER_MASS_CHECKINS(state, payload) {
            state.userMassCheckins = payload
        },
        SET_MASS_CHECKINS(state, payload) {
            state.massCheckins = payload
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
                    commit('SET_ERROR', error.message)
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
                .catch(error =>
                    commit('SET_ERROR', error.message)
                )
        },
        LOAD_MASS_CHECKINS({ commit }) {
            Vue.$db.collection('massCheckins')
                .get()
                .then(querySnapshot => {
                    let checkins = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let checkin = {
                            uid: data.user.uid,
                            data: data.date,
                            name: data.user.name,
                            surname: data.user.surname,
                            isSunday: data.isSunday,
                            time: data.time
                        }
                        checkins.push(checkin)
                    })
                    commit('SET_MASS_CHECKINS', checkins)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
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
                            data: data.date,
                            name: data.user.name,
                            surname: data.user.surname,
                            isSunday: data.isSunday
                        }
                        checkins.push(checkin)
                    })
                    var res = groupByKey(checkins, 'uid')
                    commit('SET_STATS', res)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
                )
        }
    },

    getters: {
        userMassCheckins: (state) => state.userMassCheckins,
        massCheckins: (state) => state.massCheckins,
        stats: (state) => state.stats
    }

}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}
