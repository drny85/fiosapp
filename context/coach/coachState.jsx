import React, { useReducer } from 'react'
import { db } from '../../database'

import CoachContext from './coachContext'
import coachReducer from './coachReducer'
import { ADD_COACH, GET_COACHS, COACH_ERROR } from './coachTypes'

const CoachsState = ({ children }) => {
    const initialState = {
        coachs: [],
        coach: null,
        error: null,
        loading: null
    }

    const [state, dispatch] = useReducer(coachReducer, initialState)

    const addCoach = async (coachInfo) => {
        try {
            const partners = coachInfo.partners;
            delete coachInfo.partners
            const res = await db.collection('coachs').doc(coachInfo.userId).collection('coachs').add(coachInfo)
            if (!partners.manager) {
                await db.collection('users').doc(coachInfo.userId).update({
                    coach: true
                })
            }

            return res.id;
        } catch (error) {
            console.log('Error @addCoach', error)
            dispatch({ type: COACH_ERROR, payload: error.message })
            return false
        }
    }

    const getCoachs = async (userId) => {
        try {
            if (!userId) return;
            const data = []
            await db.collection('coachs').doc(userId).collection('coachs').onSnapshot(doc => {
                return doc.forEach(ref => {
                    if (ref.exists) {
                        data.push({ id: ref.id, ...ref.data() })
                    }
                })
            })

            dispatch({ type: GET_COACHS, payload: data })
        } catch (error) {
            console.log('Error @getCoachs', error)
            dispatch({ type: COACH_ERROR, payload: error.message })
        }
    }

    return (
        <CoachContext.Provider value={{
            coachs: state.coachs,
            coach: state.coach,
            error: state.error,
            loading: state.loading,
            addCoach,
            getCoachs,
        }}>
            {children}
        </CoachContext.Provider>
    )

}


export default CoachsState