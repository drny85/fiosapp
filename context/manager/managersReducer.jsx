import { ADD_MANAGER, GET_MANAGER, GET_MANAGERS, MANAGER_LOADING, MANAGER_ERROR } from "./managersTypes";


export default (state, { type, payload }) => {
    switch (type) {
        case GET_MANAGERS:
            return {
                ...state,
                managers: payload,
                loadingManagers: false
            };
        case GET_MANAGER:
            return {
                ...state,
                manager: payload,
                loadingManagers: false
            };
        case MANAGER_LOADING:
            return {
                ...state,
                loadingManagers: true,
            }
        case MANAGER_ERROR:
            return {
                ...state,
                error: payload,
                loadingManagers: false,
            }

        default:
            return state;
    }
}