import { GET_REFERRAL, GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR } from "./referralsTypes";


export default (state, { type, payload }) => {
    switch (type) {
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
            return {
                ...state,
                loading: true,
            }
        case REFERRAL_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            }



        default:
            return state;
    }
}