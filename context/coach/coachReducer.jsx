import { GET_COACHS, GET_COACH, COACH_ERROR, COACH_LOADING } from './coachTypes'


export default (state, { type, payload }) => {
    switch (type) {
        case GET_COACHS:
            return {
                ...state,
                coachs: payload,
                loadingCoach: false
            };
        case GET_COACH:
            return {
                ...state,
                coach: ayload,
                loadingCoach: false
            };
        case COACH_LOADING:
            return {
                ...state,
                loadingCoach: true,
            }
        case 'CLEAR':
            return {
                ...state,
                error: null,
                loadingCoach: false
            }
        case COACH_ERROR:
            return {
                ...state,
                error: payload,
                loadingCoach: false,
            }

        default:
            return state;
    }
}