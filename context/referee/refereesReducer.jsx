import { RESET_MANAGERS } from "../manager/managersTypes";
import { ADD_REFEREE, GET_REFEREE, GET_REFEREES, REFEREE_LOADING, REFEREE_ERROR, RESET_REFEREE } from "./refereesTypes";


export default (state, { type, payload }) => {
    switch (type) {
        case GET_REFEREES:
            return {
                ...state,
                referees: payload,
                loadingReferees: false
            };
        case GET_REFEREE:
            return {
                ...state,
                referee: payload,
                loadingReferees: false
            };
        case REFEREE_LOADING:
            return {
                ...state,
                loadingReferees: true,
            }
        case REFEREE_ERROR:
            return {
                ...state,
                error: payload,
                loadingReferees: false,
            }
        case RESET_REFEREE:
            return {
                referees: [],
                referee: null,
                error: null,
                loadingReferees: false
            }
        case RESET_MANAGERS:
            return {
                managers: [],
                manager: null,
                error: null,
                loadingManagers: false
            }

        default:
            return state;
    }
}