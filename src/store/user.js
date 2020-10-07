import firebase from 'firebase'
import { EventBus } from '../infrastructure/eventBus'

export default {
    state: {
        user: {
            isAuthenticated: false,
            uid: null,
            email: null,
        },
        originalDisplayName: "", // to recognise user with filled profile. idea didnt work for google
        unsubscribeAuth: null
    },
    mutations: {
        SET_USER(state, payload) {
            state.user.isAuthenticated = true
            state.user.uid = payload.uid
            state.user.email = payload.email
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
        SET_ORIGINAL_DISPLAY_NAME(state, payload){
            state.originalDisplayName = payload
        }
    },
    actions: {
        INIT_AUTH({ dispatch, commit, state }) {
            console.log('init auth')
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
        SIGNUP({ commit }, payload) {
            commit('SET_PROCESSING', true)
            commit('CLEAR_ERROR')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    // firebase.auth().currentUser.updateProfile(
                    //     { photoURL: payload.photoUrl })
                    //     .then(() =>
                    //         commit('SET_USER_PHOTO', payload.photoURL)
                    //     )


                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error.message)

                })
        },
        SIGNIN({ commit }, payload) {
            commit('SET_PROCESSING', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then((res) => {
                    commit('SET_ORIGINAL_DISPLAY_NAME', res.user.displayName)
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error.message)

                })
        },
        SOCIALSIGNIN({ commit, dispatch }) {
            commit('SET_PROCESSING', true)
        
            const provider = new firebase.auth.GoogleAuthProvider()

            firebase.auth().signInWithPopup(provider)
                .then((res) => {
                    dispatch('INIT_AUTH')
                    commit('SET_ORIGINAL_DISPLAY_NAME', res.user.displayName)
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error.message)

                })
        },
        SIGNOUT() {
            firebase.auth().signOut();
        },
        STATE_CHANGED({ commit, dispatch }, payload) {
            console.log("state change")
            console.log(payload)
            if (payload) {
                commit('SET_USER', { uid: payload.uid, email: payload.email })
                // commit('SET_USER_PHOTO', payload.photoURL)
                
                dispatch('LOAD_USER_DATA', payload.uid)
                dispatch('LOAD_MARKS_BY_USER')
                dispatch('LOAD_MARKS')
                dispatch('LOAD_USERS')
            } else {
                commit('UNSET_USER')
                commit('UNSET_USER_DATA')
            }
        },
        CHANGE_USER_PROFILE_DATA({ commit }, payload) {
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
                            commit('SET_ERROR', error.message)
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
                            commit('SET_ERROR', error.message)
                        })
                }
            }).catch(function (error) {
                commit('SET_PROCESSING', false)
                commit('SET_ERROR', error.message)
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
        originalDisplayName: (state) => state.originalDisplayName
    }
}