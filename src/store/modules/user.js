import firebase from 'firebase'
import { EventBus } from '../../infrastructure/eventBus'

export default {
    state: {
        user: {
            isAuthenticated: false,
            uid: null,
            email: null,
            isAdmin: false,
            isPriest: false,
            isSenior: false
        },
        unsubscribeAuth: null
    },
    mutations: {
        SET_USER(state, payload) {
            state.user.isAuthenticated = true
            state.user.uid = payload.uid
            state.user.email = payload.email
            state.user.isAdmin = payload.isAdmin
            state.user.isPriest = payload.isPriest
            state.user.isSenior = payload.isSenior
        },
        UNSET_USER(state) {
            state.user = {
                isAuthenticated: false,
                uid: null
            }
        },
        // SET_USER_PHOTO(state, payload) {
        //     state.user.photoUrl = payload
        // },
        SET_USER_EMAIL(state, payload) {
            state.user.email = payload
        },
        SET_UNSUBSCRIBE_AUTH(state, payload) {
            state.unsubscribeAuth = payload
        },
        SET_ORIGINAL_DISPLAY_NAME(state, payload) {
            state.originalDisplayName = payload
        }
    },
    actions: {
        INIT_AUTH({ dispatch, commit, state }) {
            return new Promise((resolve) => {
                if (state.unsubscribeAuth)
                    state.unsubscribeAuth()

                let unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
                    dispatch('STATE_CHANGED', user)

                    resolve(user)
                });

                commit('SET_UNSUBSCRIBE_AUTH', unsubscribe)
            })
        },
        SIGNUP({ commit, dispatch }, payload) {
            commit('SET_PROCESSING', true)
            commit('CLEAR_ERROR')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    dispatch('CHECK_IF_NEED_PROFILE')
                    // firebase.auth().currentUser.updateProfile(
                    //     { photoURL: payload.photoUrl })
                    //     .then(() =>
                    //         commit('SET_USER_PHOTO', payload.photoURL)
                    //     )
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        SIGNIN({ commit, dispatch }, payload) {
            commit('SET_PROCESSING', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    dispatch('CHECK_IF_NEED_PROFILE')
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        SOCIALSIGNIN({ commit, dispatch }) {
            commit('SET_PROCESSING', true)

            const provider = new firebase.auth.GoogleAuthProvider()

            firebase.auth().signInWithPopup(provider)
                .then(() => {
                    dispatch('CHECK_IF_NEED_PROFILE')

                    //dispatch('INIT_AUTH')

                    // if(res.user.displayName){
                    //     let nameParts = res.user.displayName.split(' ');
                    //     dispatch('ADD_USER_DATA', {
                    //         userId: res.user.uid,
                    //         name: nameParts[0],
                    //         surname: nameParts[1]
                    //     })
                    // }

                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        SIGNOUT({ commit }) {
            firebase.auth().signOut();
            commit('SET_MESSAGE', 'logout');
        },
        STATE_CHANGED({ commit, dispatch }, firebaseUser) {
            commit('CLEAR_ERROR')

            if (firebaseUser) {

                firebaseUser.getIdTokenResult()
                    .then((r) => {
                        commit('SET_USER', {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            isAdmin: r.claims.admin == true,
                            isPriest: r.claims.priest == true,
                            isSenior: r.claims.senior == true
                        })
                        // commit('SET_USER_PHOTO', firebaseUser.photoURL)

                        dispatch('LOAD_USER_DATA', firebaseUser.uid)
                        dispatch('LOAD_MASS_CHECKINS_BY_USER')
                        dispatch('LOAD_MASS_CHECKINS')
                        dispatch('LOAD_USERS')
                    })


            } else {
                commit('UNSET_USER')
                commit('UNSET_USER_DATA')
            }
        },
        CHANGE_USER_LOGIN_DATA({ commit }, payload) {
            let user = firebase.auth().currentUser
            let credential = firebase.auth.EmailAuthProvider.credential(
                payload.email,
                payload.password
            )

            commit('SET_PROCESSING', true)
            commit('CLEAR_ERROR')

            user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                let currentUser = firebase.auth().currentUser

                if (payload.changeType == 'email') {
                    currentUser.updateEmail(payload.newEmail)
                        .then(() => {
                            commit('SET_USER_EMAIL', payload.newEmail)
                            commit('SET_PROCESSING', false)
                            EventBus.notify('user-profile-data-changed')
                        })
                        .catch(error => {
                            commit('SET_PROCESSING', false)
                            commit('SET_ERROR', error)
                            throw error
                        })
                }
                if (payload.changeType == 'password') {
                    currentUser.updatePassword(payload.newPassword)
                        .then(() => {
                            commit('SET_PROCESSING', false)
                            EventBus.notify('user-profile-data-changed')
                        })
                        .catch(error => {
                            commit('SET_PROCESSING', false)
                            commit('SET_ERROR', error)
                            throw error
                        })
                }
            }).catch(function (error) {
                commit('SET_PROCESSING', false)
                commit('SET_ERROR', error)
                throw error
            });
        },
        // CHANGE_USER_IMAGE({ commit}, payload) {
        //     commit('SET_PROCESSING', true)
        //     commit('CLEAR_ERROR')

        //     let currentUser = firebase.auth().currentUser

        //     currentUser.updateProfile({ photoURL: payload.newPhotoUrl })
        //         .then(() => {
        //             commit('SET_USER_PHOTO', payload.newPhotoUrl)
        //             commit('SET_PROCESSING', false)
        //         })
        //         .catch(error => {
        //             commit('SET_PROCESSING', false)
        //             commit('SET_ERROR', error.message)
        //         })
        // }
    },
    getters: {
        userId: (state) => state.user.uid,
        // userPhoto: (state) => state.user.photoUrl,
        userEmail: (state) => state.user.email,
        isUserAuthenticated: (state) => state.user.isAuthenticated,
        isAdmin: s => s.user.isAdmin
    }
}