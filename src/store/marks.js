import Vue from 'vue'

export default {
    state: {
        userMarks: {},
        marks: {},
        stats: {}
    },
    mutations: {
        SET_USER_MARKS(state, payload) {
            state.userMarks = payload
        },
        SET_MARKS(state, payload) {
            state.marks = payload
        },
        SET_STATS(state, payload) {
            state.stats = payload
        }
    },
    actions: {
        CHECK_IN({ commit, getters }, userMarkData) {
            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('marks').doc(`${userMarkData.date}_${userMarkData.time}_${getters.userId}`)

            userDataRef.set({
                date: userMarkData.date,
                isSunday: userMarkData.isSunday,
                parafia: {
                    parafiaName: getters.userParafia,
                },
                time: userMarkData.time,
                user: {
                    userName: getters.userName,
                    userSurname: getters.userSurname,
                    userId: getters.userId
                }


            }, { merge: true })

                .then(() => {
                    commit('SET_PROCESSING', false)

                })
                .catch(() => {
                    commit('SET_PROCESSING', false)

                })
        },
        LOAD_MARKS_BY_USER({ commit, getters }) {
            Vue.$db.collection('marks').where('user.userId', '==', getters.userId).limit(5)
                .get()
                .then(querySnapshot => {
                    let userMarks = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let userMark = {
                            id: s.id,
                            time: data.time,
                            date: data.date,
                            uid: data.user.userId,
                            name: data.user.userName,
                            surname: data.user.userSurname
                        }
                        userMarks.push(userMark)
                    })
                    commit('SET_USER_MARKS', userMarks)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
                    )
        },
        LOAD_MARKS({ commit }){
            Vue.$db.collection('marks')
                .get()
                .then(querySnapshot => {
                    let marks = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let mark = {
                            uid: data.user.userId.slice(),
                            data: data.date,
                            name: data.user.userName.slice(),
                        }
                        marks.push(mark)
                    })
                    commit('SET_MARKS', marks)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
                )
        },
    LOAD_STATS({commit}){
        Vue.$db.collection('marks')
            .get()
            .then(querySnapshot => {
                let marks = []
                querySnapshot.forEach(s => {
                    const data = s.data()
                    let mark = {
                        uid: data.user.userId,
                        data: data.date,
                        name: data.user.userName,
                        surname: data.user.userSurname,
                        isSunday: data.isSunday
                    }
                    marks.push(mark)
                })
                var res = groupByKey(marks, 'uid')
                commit('SET_STATS', res)
            })
            .catch(error =>
                commit('SET_ERROR', error.message)
            )
    }
    },

    getters: {
        userMarks: (state) => state.userMarks,
        marks: (state) => state.marks,
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
