import { GET_COACHS, GET_COACH, COACH_ERROR, COACH_LOADING } from './coachTypes'


export default (state, { type, payload }) => {
    switch (type) {
        case GET_COACHS:
            return {
                ...state,
                coachs: payload,
                loading: false
            };
        case GET_COACH:
            return {
                ...state,
                coach: ayload,
                loading: false
            };
        case COACH_LOADING:
            return {
                ...state,
                loading: true,
            }
        case COACH_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }

        default:
            return state;
    }
}