import Vue from 'vue'

export default {
    state: {
        users: []
    },
    mutations: {
        SET_USERS(state, payload){
            state.users = payload
        }
    },
    actions:{
        LOAD_USERS({commit}){
            Vue.$db.collection('userData')
            .get()
            .then(querySnapshot => {
                let users = []
                querySnapshot.forEach(s => {
                    const data = s.data()
                        let user = {
                            name: data.name
                            // date: data.date,
                            // isSunday: data.isSunday,
                            // time: data.time,
                            // user: data.user.slice()
                    }
                    
                    users.push(user)
                })

                commit('SET_USERS', users)
            })
            .catch(error => console.log(error))
        }
    },
    getters:{
        getUser: (state) => state.users
    }
}