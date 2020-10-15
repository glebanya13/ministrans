import Vue from 'vue'

export default {
    state: {
        parish:{}
    },
    mutations:{
        SET_PARISH(state, parish){
            state.parish = parish
        },
        UPDATE_SCHEDULE(state, schedule){
            state.parish.shedule = schedule
        }
    },
    actions:{
        LOAD_PARISH({commit}, parishId){
            let parishRef = Vue.$db.collection('parishes').doc(parishId)
            parishRef.get()
                .then((data) => {
                    if(data.exists){
                        commit('SET_PARISH', data.data())
                    }
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        UPDATE_MASS_SCHEDULE({commit, getters}, schedule){
            Vue.$db.collection('parishes').doc(getters.parish.id).update({'schedule': schedule})
            .then(function() {
                console.log("Parish mass schedule successfully updated!");
                commit('SET_MESSAGE','Parish mass schedule successfully updated!');
                commit('UPDATE_SCHEDULE', schedule)
                //TODO: BATCH FOR USER SCHEDULES
            })
            .catch(error => {
                commit('SET_ERROR', error)
                throw error
            })
        }
    },
    getters:{
        parish:s => s.parish
    }
}