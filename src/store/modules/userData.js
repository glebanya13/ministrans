import Vue from 'vue';
import { EventBus } from '../../infrastructure/eventBus';
import firebase from 'firebase';

let defaultUserData = {
    level: null,
    clas: null,
    name: null,
    birthday: null,
    surname: null,
    parafia: null,
};
export default {
    state: {
        userData: defaultUserData,
        users: {},
        usersForSchedule: [],
        needProfile: false
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            Vue.set(state, 'userData', payload)
        },
        SET_USERS(state, payload) {
            state.users = payload
        },
        SET_USERS_FOR_SCHEDULE(state, users) {
            state.usersForSchedule = users
        },
        UNSET_USER_DATA(state) {
            state.userData = defaultUserData
        },
        NEED_PROFILE(state) {
            state.needProfile = true;
        },
        PROFILE_EXISTS(state) {
            state.needProfile = false;
        }
    },
    actions: {
        LOAD_USER_DATA({ commit, dispatch }, payload) {

            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
                .then((data) => {

                    let userData = defaultUserData
                    if (data.exists) {
                        userData = data.data();
                    }else{
                        // in case of google auth
                        let dn = firebase.auth().currentUser.displayName
                        if (dn) {
                            let dnParts = dn.split(' ');
                            userData.name = dnParts[0]
                            userData.surname = dnParts[1]
                        }
                    }

                    if(userData.parish && userData.parish.id){
                        dispatch('LOAD_PARISH', userData.parish.id)
                    }
                    commit('SET_USER_DATA', userData)
                    commit('SET_PROCESSING', false)
                    EventBus.notify('user-data-loaded')
                })
                .catch(error => {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        ADD_USER_DATA({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);

            let userDataRef = Vue.$db.collection('userData').doc(getters.userId || payload.userId);

            var user = firebase.auth().currentUser;
            if (payload.name && !user.displayName) {
                user.updateProfile({
                    displayName: `${payload.name} ${payload.surname}`
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    commit('SET_ERROR', error);
                    throw error;
                });
            }

            userDataRef.set({
                level: payload.level,
                birthday: payload.birthday,
                clas: payload.clas,
                name: payload.name,
                surname: payload.surname,
                parafia: payload.parafia,
                userId: getters.userId || payload.userId
            }, { merge: true })

                .then(() => {
                    commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        },
        async BATCH({ getters }, payload) {
            var batch = Vue.$db.batch();

            var refs = [];
            await Vue.$db.collection("massCheckins").where("user.uid", "==", getters.userId)
            .get()
            .then(querySnapshot => {
                refs = querySnapshot.docs.map(doc =>
                    doc.ref
                )
            })
            
            refs.forEach(function(r) {
                batch.update(r, {'user.name': payload.name,
                'user.surname': payload.surname
                });

            })
            batch.commit().then(function () {
                // ...
            });
        },
        LOAD_USERS({ commit }) {
            Vue.$db.collection('userData')
                .get()
                .then(querySnapshot => {
                    let users = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let user = {
                            uid: s.id,
                            name: data.name,
                            surname: data.surname,
                            birthday: data.birthday,
                            clas: data.clas,
                            level: data.level,
                            parafia: data.parafia,
                            schedule: data.schedule
                        }
                        users.push(user)
                    })
                    commit('SET_USERS', users)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        LOAD_USERS_FOR_SCHEDULE({ commit }) {
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
                            schedule: data.schedule || {
                                vs: "",
                                pn: "",
                                vt: "",
                                sr: "",
                                cht: "",
                                pt: "",
                                sb: "",
                            },
                        }
                        users.push(user)
                    })
                    commit('SET_USERS_FOR_SCHEDULE', users)
                    commit('SET_PROCESSING', false)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    commit('SET_PROCESSING', false)
                    throw error
                })
        },
        UPDATE_SCHEDULE_FOR_USER({ commit }, user) {

            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('userData').doc(user.uid)
            userDataRef.set({
                schedule: user.schedule
            }, { merge: true })
                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch(() => {
                    commit('SET_PROCESSING', false)
                })
        },
        CHECK_IF_NEED_PROFILE({ commit }) {
            commit('PROFILE_EXISTS')
            var docRef = Vue.$db.collection("userData").doc(firebase.auth().currentUser.uid);

            docRef.get().then(function (doc) {
                if (!doc.exists) {
                    commit('NEED_PROFILE')
                }

                EventBus.notify('checked-if-need-profile')
            }).catch(function (error) {
                commit('SET_ERROR', error)
                throw error
            });

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
        usersForSchedule: (state) => state.usersForSchedule,
        needProfile: (state) => state.needProfile
    }
}