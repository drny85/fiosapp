import React, { useReducer } from 'react'
import referralsReducer from './referralsReducer'
import ReferralsContext from './referralContext'
import { db } from '../../database'
import {
    ADD_REFERRAL, CLEAR_CURRENT, GET_REFERRAL, GET_REFERRALS, LOADING_REFERRAL, REFERRAL_ERROR,
    UPDATE_REFERRAL, TODAY_UNIT, WTD_UNIT, MTD_UNIT, MOVING_THIS_WEEK, MOVING_TODAY, INSTALLING_THIS_WEEK, MOVING_TOMORROW, INSTALLING_TODAY, INSTALLING_TOMORROW, MOVING_IN_TWO_WEEKS
} from './referralsTypes'
import moment from 'moment'


const ReferralsState = ({ children }) => {
    const initialState = {
        referrals: [],
        referral: null,
        error: null,
        loading: false,
        coors: null,
        filtered: null,
        todayUnits: { units: 0, data: [] },
        wtdUnits: { units: 0, data: [] },
        mtdUnits: { units: 0, data: [] },
        movingInTwoWeeks: { units: 0, data: [] },
        movingToday: { units: 0, data: [] },
        movingTomorrow: { units: 0, data: [] },
        gettingInstalledToday: { units: 0, data: [] },
        gettingInstalledThisWeek: { units: 0, data: [] },
        gettingInstalledTomorrow: { units: 0, data: [] },
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
                calculateReferralUnits(data)
                calculateUpcomingInstallations(data)
                calculateMovingReferrals(data)

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


    const calculateReferralUnits = data => {
        const todayU = data.filter(r => r.status.name === 'Closed' && moment(r.order_date).isAfter(moment().startOf('day')) && moment(r.order_date).isBefore(moment().endOf('day')))
        const wtdU = data.filter(r => r.status.name === 'Closed' && moment(r.order_date).isAfter(moment().startOf('week').add(1, 'day')) && moment(r.order_date).isBefore(moment().endOf('day').add(1, 'day')))
        const mtdU = data.filter(r => r.status.name === 'Closed' && moment(r.order_date).isAfter(moment().startOf('month')) && moment(r.order_date).isBefore(moment().endOf('month')))

        let todayUnit = { internet: 0, tv: 0 };
        let wtdUnit = { internet: 0, tv: 0 };
        let mtdUnit = { internet: 0, tv: 0 };

        todayU.forEach(u => {
            if (u.package.internet) {

                todayUnit.internet += 1;

            }
            if (u.package.tv) {
                todayUnit.tv += 1;
            }
        })
        wtdU.forEach(u => {
            if (u.package.internet) {
                wtdUnit.internet += 1;
            }
            if (u.package.tv) {
                wtdUnit.tv += 1;
            }
        })
        mtdU.forEach(u => {
            if (u.package.internet) {
                mtdUnit.internet += 1;
            }
            if (u.package.tv) {
                mtdUnit.tv += 1;
            }
        })


        dispatch({ type: TODAY_UNIT, payload: { units: todayUnit, data: [...todayU] } })
        dispatch({ type: WTD_UNIT, payload: { units: wtdUnit, data: [...wtdU] } })
        dispatch({ type: MTD_UNIT, payload: { units: mtdUnit, data: [...mtdU] } })
    }

    const calculateMovingReferrals = data => {

        const twoWeeks = data.filter(r => r.status.id !== 'closed' && r.status.id !== 'not_sold' && moment(new Date()).isAfter(moment().startOf('day')) && moment(r.moveIn).isBefore(moment().endOf('week').add(1, 'week')))
        const today = data.filter(r => r.status.id !== 'closed' && r.status.id !== 'not_sold' && moment(r.moveIn).isAfter(moment().startOf('day')) && moment(r.moveIn).isBefore(moment().endOf('day')))
        const tomorrow = data.filter(r => r.status.id !== 'closed' && r.status.id !== 'not_sold' && moment(r.moveIn).isAfter(moment().startOf('day').add(1, 'day')) && moment(r.moveIn).isBefore(moment().endOf('day').add(1, 'day')))
        dispatch({ type: MOVING_IN_TWO_WEEKS, payload: { units: twoWeeks.length, data: [...twoWeeks] } })
        dispatch({ type: MOVING_TODAY, payload: { units: today.length, data: [...today] } })
        dispatch({ type: MOVING_TOMORROW, payload: { units: tomorrow.length, data: [...tomorrow] } })


        //dispatch({ type: MOVING_THIS_WEEK, payload: w })

    }
    const calculateUpcomingInstallations = data => {

        const thisWeek = data.filter(r => r.status.name === 'Closed' && moment(r.due_date).isAfter(moment().startOf('week')) && moment(r.due_date).isBefore(moment().endOf('week')))
        const today = data.filter(r => r.status.name === 'Closed' && moment(r.due_date).isAfter(moment().startOf('day')) && moment(r.due_date).isBefore(moment().endOf('day')))
        const tomorrow = data.filter(r => r.status.name === 'Closed' && moment(r.due_date).isAfter(moment().startOf('day').add(1, 'day')) && moment(r.due_date).isBefore(moment().endOf('day').add(1, 'day')))
        dispatch({ type: INSTALLING_THIS_WEEK, payload: { units: thisWeek.length, data: [...thisWeek] } })
        dispatch({ type: INSTALLING_TODAY, payload: { units: today.length, data: [...today] } })
        dispatch({ type: INSTALLING_TOMORROW, payload: { units: tomorrow.length, data: [...tomorrow] } })
        //dispatch({ type: MOVING_THIS_WEEK, payload: w })

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
            todayUnits: state.todayUnits,
            mtdUnits: state.mtdUnits,
            wtdUnits: state.wtdUnits,
            mtdUnits: state.mtdUnits,
            movingInTwoWeeks: state.movingInTwoWeeks,
            movingToday: state.movingToday,
            movingTomorrow: state.movingTomorrow,
            gettingInstalledThisWeek: state.gettingInstalledThisWeek,
            gettingInstalledToday: state.gettingInstalledToday,
            gettingInstalledTomorrow: state.gettingInstalledTomorrow,
            addReferral,
            getReferrals,
            getReferralById,
            clearCurrent,
            updateReferral,
            calculateReferralUnits,
            calculateMovingReferrals,
            calculateUpcomingInstallations

        }} >
            {children}
        </ReferralsContext.Provider>
    )

}

export default ReferralsState;
