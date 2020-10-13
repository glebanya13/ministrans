import Vue from 'vue'
import firebase from 'firebase'

export default {
    state: {
        userRoles:[],
        usersToUpdate:[]
    },
    mutations:{
        SET_USER_ROLES(state, userRoles){
            state.userRoles = userRoles
        }
    },
    actions:{
        LOAD_USER_ROLES({commit}){
            Vue.$db.collection('roles')
                .get()
                .then(querySnapshot => {
                    let userRoles = querySnapshot.docs.map(doc => {
                        let data = doc.data()
                        return {
                            uid: doc.id,
                            ...data
                        }
                    })
                    commit('SET_USER_ROLES', userRoles)
                }).catch(e => {
                    commit('SET_ERROR', e)
                    throw e
                })
        },
        CHANGE_ROLES({commit}, data){
            // call cloud firestore funciton
            commit('SET_MESSAGE', 'db-update')
            var addMessage = firebase.functions().httpsCallable("setUserRoles");
            addMessage(data)
                .then(function() {
                    // just show status with message
                    //commit('SET_MESSAGE', 'db-update')
                })
                .catch(function(e) {
                    commit('SET_ERROR', e)
                    throw e
                });
        }
    },
    getters:{
        userRoles: s => s.userRoles
    }
}