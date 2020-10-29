import Vue from 'vue'
export default {
    actions: {
        LOAD_MARKS_DATA({state}, payload) {
            var markscollection = JSON.parse(payload)
            console.log(state)
            markscollection.forEach(function (obj) {
                Vue.$db.collection("massCheckins").doc(`${obj.date}_${obj.time}_${obj.uid}`).set({
                    user: {
                        uid: obj.uid,
                        name: obj.name,
                        surname: obj.surname,
                    },
                    date: obj.date,
                    isSunday: obj.isSunday,
                    time: obj.time
                })
            })
        },
        LOAD_USERS_DATA({state}, payload) {
            var userscollection = JSON.parse(payload)
            console.log(state)
            console.log(userscollection)
            userscollection.forEach(function (obj) {
                Vue.$db.collection("userData").doc(obj.uid).set({
                    uid: obj.uid,
                    name: obj.name,
                    surname: obj.surname,
                    birthday: obj.birthday,
                    clas: obj.clas,
                    level: obj.level,
                    parish: obj.parish || '',
                    myschedule: obj.myschedule || ''
                })
            })
        },
        LOAD_MEET_DATA({state}, payload) {
            var markscollection = JSON.parse(payload)
            console.log(state)
            markscollection.forEach(function (obj) {

                Vue.$db.collection("meetingCheckins").doc(`${obj.date}_${obj.uid}`).set({
                    user: {
                    name: obj.name,
                    surname: obj.surname,
                    uid: obj.uid
                    },
                    date: obj.date,
                    isMeeting: obj.isMeeting
                })
            })
        },
        
    }
}