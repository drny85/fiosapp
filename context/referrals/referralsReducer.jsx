import { ADD_REFERRAL, CLEAR_CURRENT, GET_REFERRAL, GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR, UPDATE_REFERRAL } from "./referralsTypes";


export default (state, { type, payload }) => {
    switch (type) {
        case ADD_REFERRAL:
            return {
                ...state,
                loading: false,
            }
        case GET_REFERRALS:
            return {
                ...state,
                referrals: payload,
                loading: false
            };

        case GET_REFERRAL:
            return {
                ...state,
                referral: payload,
                loading: false
            };
        case LOADING_REFERRAL:
            console.log('LLLLL')
            return {
                ...state,
                loading: true,
            }
        case REFERRAL_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case UPDATE_REFERRAL:
            return {
                ...state,
                loading: false,
                error: null,
            }
        case CLEAR_CURRENT:
            return {
                ...state,
                loading: false,
                referral: null,
            }



        default:
            return state;
    }
}