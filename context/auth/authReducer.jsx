import { SIGN_IN, SIGN_OUT, USER_LOADING, USER_ERROR, CLEAR_ERROR } from './authTypes'


export default (state, { type, payload }) => {
    switch (type) {
        case SIGN_IN:
            return {
                ...state,
                user: payload,
                loading: false
            };
        case SIGN_OUT:
            return {
                ...state,
                user: null,
                loading: false
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            }
        case USER_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case CLEAR_ERROR:
            return {
                ...state,
                loading: false,
                error: null
            }



        default:
            return state;
    }
}