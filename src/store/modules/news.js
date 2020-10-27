import Vue from 'vue'
import firebase from 'firebase'

let defaultNewsData = {
    header: null,
    p1: null,
    date: null,
    url: null
}
export default {
    state:{
        newsData: defaultNewsData,
        news:{}
    },
    mutations:{
        SET_NEWS(state, payload) {
            state.news = payload
        },
    },
    actions:{
        ADD_NEWS({ commit }, payload) {
            commit('SET_PROCESSING', true);

            let imageUrl

            Vue.$db.collection('news').doc(payload.date)
            .set({
                date: payload.date,
                header: payload.header,
                p1: payload.p1,
            }, { merge: true })

            .then(() => {
                const filename = payload.image.name
                let storageRef = firebase.storage().ref(`news/${filename}`).put(payload.image);
                return storageRef
            })
            .then(fileData => {
                fileData.ref.getDownloadURL().then(url => {
                    imageUrl = url
                    return Vue.$db.collection('news').doc(payload.date).update({ url: imageUrl })
                })
            })
                .then(() => {
                    commit('SET_PROCESSING', false);
                    // commit('SET_MESSAGE', 'Картинка загрузилась. Перезагрузите страницу') //todo убрать
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        },
        LOAD_NEWS({ commit }) {
            Vue.$db.collection('news')
                .get()
                .then(querySnapshot => {
                    let news = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let article = {
                            date: data.date,
                            header: data.header,
                            p1: data.p1,
                            url: data.url
                        }
                        news.push(article);
                        news.reverse();
                    })
                    commit('SET_NEWS', news)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
    },
    getters:{
        news: (state) => state.news
    }
}