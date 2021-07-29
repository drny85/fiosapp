import React, { useReducer } from 'react'
import { db } from '../../database'

import RefereesContext from './refereesContext'
import refereesReducer from './refereesReducer'
import { GET_REFEREES, REFEREE_ERROR } from './refereesTypes'

const RefereesState = ({ children }) => {
    const initialState = {
        referees: [],
        referee: null,
        error: null,
        loading: false
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

    const getReferees = async (userId) => {
        try {
            console.log('Getting Referees')
            if (!userId) return;
            const data = []
            await db.collection('referees').doc(userId).collection('referees').onSnapshot(doc => {
                return doc.forEach(ref => {
                    if (ref.exists) {
                        data.push({ id: ref.id, ...ref.data() })
                    }
                })
            })

            dispatch({ type: GET_REFEREES, payload: data })
        } catch (error) {
            console.log('Error @getReferees', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
        }
    }

    return (
        <RefereesContext.Provider value={{
            referees: state.referees,
            referee: state.referee,
            error: state.error,
            loading: state.loading,
            addReferee,
            getReferees,
        }}>
            {children}
        </RefereesContext.Provider>
    )

}


export default RefereesState