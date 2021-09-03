import React, { useReducer } from 'react'
import { db } from '../../database'

import CoachContext from './coachContext'
import coachReducer from './coachReducer'
import { ADD_COACH, GET_COACHS, COACH_ERROR, COACH_LOADING } from './coachTypes'

const CoachsState = ({ children }) => {
    const initialState = {
        coachs: [],
        coach: null,
        error: null,
        loadingCoach: false
    }

    const [state, dispatch] = useReducer(coachReducer, initialState)

    const addCoach = async (coachInfo) => {
        try {
            const partners = coachInfo.partners;
            const found = await (await db.collection('coachs').doc(coachInfo.userId).collection('coachs').get()).size
            if (found > 0) {
                console.log('No more')
                dispatch({ type: COACH_ERROR, payload: 'Only one coach allowed' })
                setTimeout(() => {
                    dispatch({ type: "CLEAR" })
                }, 2000)
                return false
            }

            delete coachInfo.partners
            const res = await db.collection('coachs').doc(coachInfo.userId).collection('coachs').add(coachInfo)
            await db.collection('users').doc(coachInfo.userId).set({ coachInfo: coachInfo, coach: true }, { merge: true })

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
            setLoadingCoach()

            db.collection('coachs').doc(userId).collection('coachs').onSnapshot(doc => {
                const data = []
                doc.docs.map(d => {
                    if (d.exists) {
                        data.push({ id: d.id, ...d.data() })
                    }
                })
                dispatch({ type: GET_COACHS, payload: data })
            })


        } catch (error) {
            console.log('Error @getCoachs', error)
            dispatch({ type: COACH_ERROR, payload: error.message })
        }
    }

    const setLoadingCoach = () => dispatch({ type: COACH_LOADING })

    return (
        <CoachContext.Provider value={{
            coachs: state.coachs,
            coach: state.coach,
            error: state.error,
            loadingCoach: state.loadingCoach,
            addCoach,
            getCoachs,
        }}>
            {children}
        </CoachContext.Provider>
    )

}


export default CoachsState