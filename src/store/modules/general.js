export default {
    state: {
        processing: false,
        error: null,
        message: null
    },
    mutations: {
        SET_PROCESSING(state, payload) {
            state.proccesing = payload
        },
        SET_ERROR(state, payload) {
            state.error = payload
        },
        CLEAR_ERROR(state) {
            state.error = null
        },
        SET_MESSAGE(state, payload) {
            state.message = payload
        },
        CLEAR_MESSAGE(state) {
            state.message = null
        }
    },
    getters: {
        getProcessing: (state) => state.processing,
        getError: (state) => state.error,
        getMessage: (s) => s.message
    },
}