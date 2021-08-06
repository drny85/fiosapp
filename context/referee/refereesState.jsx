import React, { useReducer } from 'react'
import { db } from '../../database'

import RefereesContext from './refereesContext'
import refereesReducer from './refereesReducer'
import { GET_REFEREES, REFEREE_ERROR, REFEREE_LOADING } from './refereesTypes'

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

    const getReferees = async (userId) => {
        try {
            console.log('Getting Referees')
            if (!userId) return;
            setLoadingReferees()
            await db.collection('referees').doc(userId).collection('referees').onSnapshot(doc => {
                const data = []
                return doc.forEach(ref => {
                    if (ref.exists) {
                        data.push({ id: ref.id, ...ref.data() })
                    }
                    dispatch({ type: GET_REFEREES, payload: data })
                })


            })


        } catch (error) {
            console.log('Error @getReferees', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
        }
    }

    const setLoadingReferees = () => dispatch({ type: REFEREE_LOADING })

    return (
        <RefereesContext.Provider value={{
            referees: state.referees,
            referee: state.referee,
            error: state.error,
            loadingReferees: state.loadingReferees,
            addReferee,
            getReferees,
        }}>
            {children}
        </RefereesContext.Provider>
    )

}


export default RefereesState