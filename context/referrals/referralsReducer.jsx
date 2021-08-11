import {
    ADD_REFERRAL, CLEAR_CURRENT, GET_REFERRAL, GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR,
    TODAY_UNIT, UPDATE_REFERRAL, WTD_UNIT, MTD_UNIT, MOVING_TODAY, MOVING_IN_TWO_WEEKS,
    INSTALLING_TOMORROW, INSTALLING_TODAY, MOVING_TOMORROW, INSTALLING_THIS_WEEK
} from "./referralsTypes";


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
        case TODAY_UNIT:
            return {
                ...state,
                loading: false,
                todayUnits: payload
            };
        case WTD_UNIT:
            return {
                ...state,
                loading: false,
                wtdUnits: payload
            };
        case MTD_UNIT:
            return {
                ...state,
                loading: false,
                mtdUnits: payload
            }
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
            };
        case MOVING_TODAY:
            return {
                ...state,
                loading: false,
                movingToday: payload
            };
        case MOVING_TOMORROW:
            return {
                ...state,
                loading: false,
                movingTomorrow: payload
            };
        case MOVING_IN_TWO_WEEKS:
            return {
                ...state,
                movingInTwoWeeks: payload
            };
        case INSTALLING_TODAY:
            return {
                ...state,
                gettingInstalledToday: payload,
                loading: false
            };
        case INSTALLING_THIS_WEEK:
            return {
                ...state,
                installedYesterday: payload,
                loading: false
            }
        case INSTALLING_TOMORROW:
            return {
                ...state,
                gettingInstalledTomorrow: payload
            }



        default:
            return state;
    }
}