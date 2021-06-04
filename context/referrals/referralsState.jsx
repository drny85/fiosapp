import React, { useReducer } from 'react'
import referralsReducer from './referralsReducer'
import ReferralsContext from './referralContext'
import { db } from '../../database'
import { GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR } from './referralsTypes'

const ReferralsState = ({ children }) => {
    const initialState = {
        referrals: [],
        referral: null,
        error: null,
        loading: false,
        filtered: null
    }

    const [state, dispatch] = useReducer(referralsReducer, initialState)

    const addReferral = async (referral) => {
        try {
            dispatch({ type: LOADING_REFERRAL })
            referral.date_entered = new Date().toISOString()
            referral.due_date = null;
            referral.order_date = null
            referral.status = 'new'
            referral.package = null;
            referral.updated = null;
            referral.mon = null;
            referral.collateral_sent = false;
            referral.collateral_sent_on = null;
            referral.property = null;
            const res = await db.collection('referrals').doc(referral.userId).collection('referrals').add(referral)
            return true

        } catch (error) {
            console.log('Error @addreferral', error)
            dispatch({ type: REFERRAL_ERROR, payload: error.message })
            return false
        }
    }

    const getReferrals = async (userId) => {
        try {

            if (!userId) return;
            dispatch({ type: LOADING_REFERRAL })
            const data = []
            const listener = await db.collection('referrals').doc(userId).collection('referrals').onSnapshot(docs => {
                docs.forEach(doc => {
                    if (doc.exists) {
                        data.push({ id: doc.id, ...doc.data() })
                    }
                })
                dispatch({ type: GET_REFERRALS, payload: data })
            })

            return listener;

        } catch (error) {
            console.log('Error @getReferrals', error)
            dispatch({ type: REFERRAL_ERROR, payload: error.message })
            return false
        }
    }


    return (
        <ReferralsContext.Provider value={{
            referral: state.referral,
            referrals: state.referrals,
            loading: state.loading,
            error: state.error,
            filtered: state.filtered,
            addReferral,
            getReferrals,
        }} >
            {children}
        </ReferralsContext.Provider>
    )

}

export default ReferralsState;
