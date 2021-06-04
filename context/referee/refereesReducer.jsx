import { ADD_REFEREE, GET_REFEREE, GET_REFEREES, REFEREE_LOADING, REFEREE_ERROR } from "./refereesTypes";


export default (state, { type, payload }) => {
    switch (type) {
        case GET_REFEREES:
            return {
                ...state,
                referees: payload,
                loading: false
            };
        case GET_REFEREE:
            return {
                ...state,
                referee: payload,
                loading: false
            };
        case REFEREE_LOADING:
            return {
                ...state,
                loading: true,
            }
        case REFEREE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }

        default:
            return state;
    }
}