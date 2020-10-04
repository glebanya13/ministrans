import Vue from 'vue'

export default {
    state: {
        time: null,
        date: null,
        isSunday: false,
        userMarks: {},
        marks: {}
    },
    mutations: {
        LOAD_DATE(state, payload) {
            state.time = payload
            state.date = payload
            state.isSunday = payload
        },
        SET_USER_MARKS(state, payload) {
            state.userMarks = payload
        },
        SET_MARKS(state, payload) {
            state.marks = payload
        }
    },
    actions: {
        CHECK_IN({ commit, getters }, state) {
            commit('SET_PROCESSING', true)

            commit('LOAD_DATE')


            let userDataRef = Vue.$db.collection('marks').doc(`${state.date}_${state.time}_${getters.userId}`)

            userDataRef.set({
                date: state.date,
                isSunday: state.isSunday,
                parafia: {
                    parafiaName: getters.userParafia,
                },
                time: state.time,
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
                            uid: data.user.userId.slice(),
                            name: data.user.userName.slice(),
                            surname: data.user.userSurname.slice()
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
                            id: s.id,
                            time: data.time,
                            date: data.date,
                            uid: data.user.userId.slice(),
                            name: data.user.userName.slice(),
                            surname: data.user.userSurname.slice()
                        }
                        marks.push(mark)
                    })
                    commit('SET_MARKS', marks)
                })
                .catch(error =>
                    commit('SET_ERROR', error.message)
                )
        }
    },
    getters: {
        userMarks: (state) => state.userMarks,
        marks: (state) => state.marks
    }
}