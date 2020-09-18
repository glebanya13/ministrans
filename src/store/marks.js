import Vue from 'vue'

export default {
    state: {
        time: null,
        date: null,
        isSunday: false
    },
    mutations: {
        LOAD_DATE(state, payload){
            state.time = payload
            state.date = payload
            state.isSunday = payload
        },
    },
    actions: {
        CHECK_IN({commit, getters}, state){
            commit('SET_PROCESSING', true)

            commit('LOAD_DATE')


            let userDataRef = Vue.$db.collection('marks').doc(`${state.date}_${state.time}_${getters.userId}`)
            
            userDataRef.set({
                date: state.date,
                isSunday: state.isSunday,
                parafia:{
                    parafiaName: getters.userParafia,
                },
                time: state.time,
                user:{
                    userName: getters.userName,
                    userSurname: getters.userSurname,
                    userId: getters.userId
                }   

                
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
        userDate: (state) => state.date
    }
}