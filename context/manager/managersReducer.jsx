import { ADD_MANAGER, GET_MANAGER, GET_MANAGERS, MANAGER_LOADING, MANAGER_ERROR } from "./managersTypes";


export default (state, { type, payload }) => {
    switch (type) {
        case GET_MANAGERS:
            return {
                ...state,
                managers: payload,
                loading: false
            };
        case GET_MANAGER:
            return {
                ...state,
                manager: payload,
                loading: false
            };
        case MANAGER_LOADING:
            return {
                ...state,
                loading: true,
            }
        case MANAGER_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }

        default:
            return state;
    }
}