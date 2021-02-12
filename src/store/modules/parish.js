import Vue from 'vue'
import { EventBus } from '../../infrastructure/eventBus'
import moment from "moment";

export default {
    state: {
        parish: {},
        parishList: [],
        y: 1
    },
    mutations: {
        SET_PARISH(state, parish) {
            state.parish = parish
        },
        UPDATE_SCHEDULE(state, schedule) {
            state.parish.shedule = schedule
        },
        SET_PARISH_LIST(state, parishList) {
            state.parishList = parishList
        }
    },
    actions: {
        LOAD_PARISH({ commit }, parishId) {
            let parishRef = Vue.$db.collection('parishes').doc(parishId)
            parishRef.get()
                .then((data) => {
                    if (data.exists) {
                        commit('SET_PARISH', data.data())
                        EventBus.notify('parish-is-loaded')
                    }
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        LOAD_ALL_PARISHES({ commit }) {
            Vue.$db.collection('parishes')
                .get()
                .then(querySnapshot => {
                    let items = []
                    querySnapshot.forEach(s => {
                        const item = s.data()
                        items.push({ ...item })
                    })
                    commit('SET_PARISH_LIST', items)
                    EventBus.notify('parish-list-is-loaded')
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        UPDATE_MASS_SCHEDULE({ commit, getters }, schedule) {
            Vue.$db.collection('parishes').doc(getters.parish.id).update({ 'schedule': schedule })
                .then(function () {
                    console.log("Parish mass schedule successfully updated!");
                    commit('SET_MESSAGE', 'Parish mass schedule successfully updated!');
                    commit('UPDATE_SCHEDULE', schedule)
                    //TODO: BATCH FOR USER SCHEDULES
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        PROCESS_WEEK({ getters }, parishId) {
            if (getters.parish.week != undefined || null) {


                let x = getters.parish.week
                let y = getters.parish.lastWeek
                console.log(x, y)

                let parishRef = Vue.$db.collection('parishes').doc(parishId)

                if (x > 4) {
                    parishRef.update({
                        week: 1,
                        lastWeek: 0
                    })
                }

                if (moment().format('d') == 0 && x == y) {
                    parishRef.update({
                        week: x + 1
                    })
                }

                if (moment().format('d') != 0 && y < x) {
                    parishRef.update({
                        lastWeek: y + 1
                    })
                }
            }
        }
    },
    getters: {
        parish: s => s.parish,
        parishList: s => s.parishList
    }
}