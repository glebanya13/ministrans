import Vue from 'vue'
export default {
    actions: {
        LOAD_MARKS_DATA() {
            var markscollection = [
                { "uid": "B2ccVIFuB8ReZOsKXf1xC4wgaDR2", "data": "2020-10-04", "name": "Глеб", "surname": "Шершнёв", "isSunday": true, "time": "11:00" },
                { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "data": "2020-10-04", "name": "Слава", "surname": "Синковец", "isSunday": true, "time": "18:00" },
                { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "data": "2020-10-06", "name": "Слава", "surname": "Синковец", "isSunday": false, "time": "18:00" },
                { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "data": "2020-10-07", "name": "Слава", "surname": "Синковец", "isSunday": false, "time": "18:00" },
                { "uid": "V2ccTIJH09X5AS3Zaz6u2T5KBNt1", "data": "2020-10-08", "name": "Кс. Евгени1", "surname": "Шиманович", "isSunday": false, "time": "09:00" },
                { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "data": "2020-10-08", "name": "Слава", "surname": "Синковец", "isSunday": false, "time": "18:00" },
                { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "data": "2020-10-09", "name": "Слава", "surname": "Синковец", "isSunday": false, "time": "18:00" },
                { "uid": "V2ccTIJH09X5AS3Zaz6u2T5KBNt1", "data": "2020-10-10", "name": "Кс. Евгени", "surname": "Шиманович", "isSunday": false, "time": "18:00" },
                { "uid": "WR9oKbO2FxXCjcntV1GB0oSUcya2", "data": "2020-10-10", "name": "Женя", "surname": "Долгалёв", "isSunday": false, "time": "18:00" }
            ]
            markscollection.forEach(function (obj) {
                Vue.$db.collection("massCheckins").doc(`${obj.data}_${obj.time}_${obj.uid}`).set({
                    user: {
                        uid: obj.uid,
                        name: obj.name,
                        surname: obj.surname,
                    },
                    date: obj.data,
                    isSunday: obj.isSunday,
                    time: obj.time
                })
            })
        },
        LOAD_USERS_DATA() {
            var userscollection = [
                { "uid": "AFl6OTy77lWOTtQVzYXoIIsdPYd2", "name": "Никита ", "surname": "Ловцевич ", "birthday": "2007-02-01", "clas": "Восьмой", "level": "Аспирант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pt": "", "pn": "", "sr": "", "vs": "11:00", "cht": "09:00", "vt": "", "sb": "" } }, { "uid": "B2ccVIFuB8ReZOsKXf1xC4wgaDR2", "name": "Глеб", "surname": "Шершнёв", "birthday": "2006-07-22", "clas": "Девятый", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pt": "", "pn": "", "cht": "18:00", "sb": "", "vt": "", "sr": "", "vs": "09:30;11:00" } }, { "uid": "QEHnUUNoxXbKFi9dlXhsn9ZlOiD3", "name": "Стас", "surname": "Бервячёнок", "birthday": "2004-09-25", "clas": "Десятый", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pn": "", "vs": "11:00;18:00", "sr": "", "vt": "", "sb": "", "cht": "", "pt": "" } }, { "uid": "V2ccTIJH09X5AS3Zaz6u2T5KBNt1", "name": "Кс. Евгени1", "surname": "Шиманович", "birthday": "2020-10-10", "clas": "Пятый", "level": "Ксендз", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "sb": "", "pt": "", "sr": "", "vt": "", "pn": "", "cht": "", "vs": "" } }, { "uid": "WR9oKbO2FxXCjcntV1GB0oSUcya2", "name": "Женя", "surname": "Долгалёв", "birthday": "2006-03-01", "clas": "Девятый", "level": "Лектар", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "vt": "18:00", "sr": "18:00", "sb": "18:00", "pt": "18:00", "vs": "11:00;18:00", "pn": "", "cht": "18:00" } }, { "uid": "WXvaNTmB2OfAURcBcxwuk3KGoYA2", "name": "Андрей", "surname": "Рабковский", "birthday": "2008-07-22", "clas": "Шестой", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pt": "", "sb": "", "sr": "18:00", "cht": "", "pn": "", "vt": "", "vs": "13:00;18:00" } }, { "uid": "aiQImzC5iOPT552nBX941qAevkk2", "name": "Никита", "surname": "Сайковский", "birthday": "2004-11-10", "clas": "Десятый", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pn": "", "vt": "", "sb": "", "pt": "18:00", "vs": "11:00", "sr": "", "cht": "18:00" } }, { "uid": "c5P2kTu9KXXJyOOaM4peEwLa07A3", "name": "Слава", "surname": "Синковец", "birthday": "2006-08-15", "clas": "Девятый", "level": "Аспирант", "parafia": "Святой Троицы, г. Глубокое" }, { "uid": "eEz6d5YLSuPprjqILI3q6lgvbau1", "name": "Максим ", "surname": "Внучкин ", "birthday": "2003-11-08", "clas": "Одиннадцатый", "level": "Лектар", "parafia": "Святой Троицы, г. Глубокое" }, { "uid": "nyWsgEl6QlQFTb8hdbpae0UVhIE2", "name": "Кирилл", "surname": "Хиневич", "birthday": "2006-06-12", "clas": "Девятый", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "cht": "", "sr": "", "pt": "18:00", "vt": "", "vs": "11:00;18:00", "pn": "", "sb": "" } }, { "uid": "oPXrfefDsOTias23qNjcyLyAs6y2", "name": "Emil", "surname": "Konchevskii", "birthday": "2006-06-05", "clas": "Девятый", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "vt": "", "sr": "", "cht": "18:00", "pt": "", "vs": "09:30;11:00", "sb": "", "pn": "18:00" } }, { "uid": "qP41MVG8sGcdUq0mTizf1uTNHP63", "name": "Виталий", "surname": "Радишевский", "birthday": "2008-03-08", "clas": "Седьмой", "level": "Министрант", "parafia": "Святой Троицы, г. Глубокое", "schedule": { "pn": "", "vs": "09:30;13:00", "sb": "", "cht": "", "pt": "", "vt": "", "sr": "" } }
            ]
            userscollection.forEach(function (obj) {
                Vue.$db.collection("userData").doc(obj.uid).set({
                    uid: obj.uid,
                    name: obj.name,
                    surname: obj.surname,
                    birthday: obj.birthday,
                    clas: obj.clas,
                    level: obj.level,
                    parafia: obj.parafia,
                    schedule: obj.schedule
                })
            })
        },
    }
}