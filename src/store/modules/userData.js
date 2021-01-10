import Vue from 'vue';
import { EventBus } from '../../infrastructure/eventBus';
import firebase from 'firebase';

let defaultUserData = {
    level: null,
    clas: null,
    name: null,
    birthday: null,
    surname: null,
    parish: {},
    url: null,
    phone: null,
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
                    } else {
                        // in case of google auth
                        let dn = firebase.auth().currentUser.displayName
                        if (dn) {
                            let dnParts = dn.split(' ');
                            userData.name = dnParts[0]
                            userData.surname = dnParts[1]
                        }
                    }

                    if (userData.parish && userData.parish.id) {
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
                parish: payload.parish,
                userId: getters.userId || payload.userId,
                phone: payload.phone
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
        ADD_USER_IMAGE({ commit, getters, state }, payload) {
            commit('setLoading', true);
            let imageUrl
            const filename = payload.url.name
            let storageRef = firebase.storage().ref(`${getters.userId}/${filename}`).put(payload.url);
            return storageRef
                .then(fileData => {
                    fileData.ref.getDownloadURL().then(url => {
                        imageUrl = url
                        state.userData.url = url
                        return Vue.$db.collection('userData').doc(getters.userId).update({ url: imageUrl })
                    })
                })

                .then(() => {
                    setTimeout(() => {
                        commit('setLoading', false)

                    }, 1000)
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    setTimeout(() => {
                        commit('setLoading', false)

                    }, 1000)
                    throw e;
                });
        },
        ADD_USER_PHONE({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId || payload.userId);
            userDataRef.set({
                phone: payload.phone
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
        async BATCH({ getters, commit }, payload) {
            var batch = Vue.$db.batch();

            var refs = [];
            await Vue.$db.collection("massCheckins").where("user.uid", "==", getters.userId)
                .get()
                .then(querySnapshot => {
                    refs = querySnapshot.docs.map(doc =>
                        doc.ref
                    )
                })

            refs.forEach(function (r) {
                batch.update(r, {
                    'user.name': payload.name,
                    'user.surname': payload.surname
                });

            })
            batch.commit().then(function () {
                // ...
            })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                });
        },
        async REMOVE_FIELD_FOR_USERS({ commit }, users) {
            var batch = Vue.$db.batch();

            users.forEach(function (u) {
                batch.update(Vue.$db.collection("userData").doc(u.uid),
                    {
                        schedule: firebase.firestore.FieldValue.delete()
                    });

            })
            batch.commit().then(function (r) {
                commit('SET_MESSAGE', `For ${users.length} users SCHEDULE field was deleted`)
                console.log('field schedule was deleted', r)
            })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                });
        },
        async REMOVE_FIELD_PARAFIA_FOR_USERS({ commit }, users) {
            var batch = Vue.$db.batch();

            users.forEach(function (u) {
                batch.update(Vue.$db.collection("userData").doc(u.uid),
                    {
                        parafia: firebase.firestore.FieldValue.delete()
                    });

            })
            batch.commit().then(function (r) {
                commit('SET_MESSAGE', `For ${users.length} users PARAFIA field was deleted`)
                console.log('field schedule was deleted', r)
            })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                });
        },
        async SET_DEFAULT_PARISH_FOR_USERS({ commit }, users) {
            var batch = Vue.$db.batch();

            users.forEach(function (u) {
                batch.update(Vue.$db.collection("userData").doc(u.uid),
                    {
                        'parish.name': "Святой Троицы, г. Глубокое",
                        'parish.id': "FE3rlsXPCXvXkiN5wJix"
                    });

            })
            batch.commit().then(function (r) {
                commit('SET_MESSAGE', `${users.length} users are updated to default parish`)
                console.log('set def parish result', r)
            })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
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
                            parish: data.parish,
                            url: data.url,
                            myschedule: data.myschedule
                        }
                        users.push(user)
                    })
                    commit('SET_USERS', users)
                    EventBus.notify('users-are-loaded')
                    // run only one time!
                    //dispatch('SET_DEFAULT_PARISH_FOR_USERS', users)
                    //
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },

        UPDATE_SCHEDULE_FOR_USER({ commit, dispatch }, user) {

            commit('SET_PROCESSING', true)

            let userDataRef = Vue.$db.collection('userData').doc(user.uid)
            userDataRef.set({
                myschedule: user.myschedule
            }, { merge: true })
                .then(() => {
                    commit('SET_PROCESSING', false)
                    dispatch('LOAD_USERS')
                })
                .catch((error) => {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
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
        users: (s) => s.users,
        userData: (s) => s.userData,
        userName: (s) => s.userData.name,
        userLevel: (s) => s.userData.level,
        userSurname: (s) => s.userData.surname,
        userBirthday: (s) => s.userData.birthday,
        userClas: (s) => s.userData.clas,
        userParafia: (s) => s.userData.parish ? s.userData.parish.name : '',
        usersForSchedule: (s) => s.usersForSchedule,
        needProfile: (s) => s.needProfile,
        url: (s) => s.userData.url,
        phone: (s) => s.userData.phone
    }
}