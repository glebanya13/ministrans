export default {
    state: {
        processing: false,
        error: null,
        message: null,
        loading: false
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload
        },
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
        loading: (state) => state.loading,
        getProcessing: (state) => state.processing,
        getError: (state) => state.error,
        getMessage: (s) => s.message
    },
}