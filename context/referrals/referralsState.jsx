import React, { useReducer } from 'react'
import referralsReducer from './referralsReducer'
import ReferralsContext from './referralContext'
import { db } from '../../database'
import { ADD_REFERRAL, CLEAR_CURRENT, GET_REFERRAL, GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR, UPDATE_REFERRAL } from './referralsTypes'
import referralsContext from './referralContext'
import { states } from '../../states'


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

            const res = await db.collection('referrals').doc(referral.userId).collection('referrals').add(referral)
            if (res.id) dispatch({ type: ADD_REFERRAL })

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
            setReferralLoading()

            const listener = await db.collection('referrals').doc(userId).collection('referrals').orderBy('moveIn', 'asc').onSnapshot(docs => {
                const data = []
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

    const getReferralById = async ({ userId, id }) => {
        try {
            setReferralLoading()

            const res = await db.collection('referrals').doc(userId).collection('referrals').doc(id).get()
            dispatch({ type: GET_REFERRAL, payload: { id: res.id, ...res.data() } })
        } catch (error) {
            console.log('Error @getReferralById', error.message)
            dispatch({ type: REFERRAL_ERROR, payload: error.message })
            return false
        }
    }

    const clearCurrent = () => dispatch({ type: CLEAR_CURRENT })

    const setReferralLoading = () => {
        
        dispatch({ type: LOADING_REFERRAL })
    }

    const updateReferral = async referral => {
        try {
            setReferralLoading()
            await db.collection('referrals').doc(referral.userId).collection('referrals').doc(referral.id).update(referral)
            dispatch({ type: UPDATE_REFERRAL })
            return true
        } catch (error) {
            console.log('Error @updateReferral', error.message)
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
            getReferralById,
            clearCurrent,
            updateReferral,
        }} >
            {children}
        </ReferralsContext.Provider>
    )

}

export default ReferralsState;
