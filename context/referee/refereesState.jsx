import React, { useReducer } from 'react'
import { db } from '../../database'

import RefereesContext from './refereesContext'
import refereesReducer from './refereesReducer'
import { GET_REFEREES, REFEREE_ERROR, REFEREE_LOADING, RESET_REFEREE } from './refereesTypes'

const RefereesState = ({ children }) => {
    const initialState = {
        referees: [],
        referee: null,
        error: null,
        loadingReferees: false
    }

    const [state, dispatch] = useReducer(refereesReducer, initialState)

    const addReferee = async (refereeInfo) => {
        try {

            const res = await db.collection('referees').doc(refereeInfo.userId).collection('referees').add(refereeInfo)
            return res.id;
        } catch (error) {
            console.log('Error @addReferee', error)
            dispatch({ type: REFEREE_ERROR, payload: error.message })
            return false
        }
    }

    const updateReferee = async (referee) => {
        try {

            const res = await db.collection('referees').doc(referee.userId).collection('referees').doc(referee.id).update(referee)
            return true
        } catch (error) {
            console.log('Error @updateReferee', error)
            dispatch({ type: REFEREE_ERROR, payload: error.message })
            return false
        }
    }
    const deleteReferee = async (referee) => {
        try {

            const res = db.collection('referees').doc(referee.userId).collection('referees').doc(referee.id).delete()
            return true
        } catch (error) {
            console.log('Error @deleteReferee', error)
            dispatch({ type: REFEREE_ERROR, payload: error.message })
            return false
        }
    }

    const getReferees = async (userId) => {
        try {

            if (!userId) return;
            setLoadingReferees()
            db.collection('referees').doc(userId).collection('referees').orderBy('name', 'asc').onSnapshot(doc => {
                const data = []
                doc.docs.map(d => {
                    if (d.exists) {
                        data.push({ id: d.id, ...d.data() })
                    }
                })
                dispatch({ type: GET_REFEREES, payload: data })

            })


        } catch (error) {
            console.log('Error @getReferees', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
        }
    }

    const resetRefereeState = () => dispatch({ type: RESET_REFEREE })

    const setLoadingReferees = () => dispatch({ type: REFEREE_LOADING })

    return (
        <RefereesContext.Provider value={{
            referees: state.referees,
            referee: state.referee,
            error: state.error,
            loadingReferees: state.loadingReferees,
            addReferee,
            getReferees,
            resetRefereeState,
            updateReferee,
            deleteReferee,
        }}>
            {children}
        </RefereesContext.Provider>
    )

}


export default RefereesState