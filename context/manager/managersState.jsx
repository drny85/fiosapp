import React, { useReducer } from 'react'
import { db } from '../../database'

import ManagersContext from './managersContext'
import managersReducer from './managersReducer'
import { GET_MANAGERS, MANAGER_ERROR, MANAGER_LOADING } from './managersTypes'

const ManagersState = ({ children }) => {
    const initialState = {
        managers: [],
        manager: null,
        error: null,
        loading: false
    }

    const [state, dispatch] = useReducer(managersReducer, initialState)

    const addManager = async (managerInfo) => {
        try {
            const partners = managerInfo.partners;
            delete managerInfo.partners
            const res = await db.collection('managers').doc(managerInfo.userId).collection('managers').add(managerInfo)
            if (!partners.manager) {
                await db.collection('users').doc(managerInfo.userId).update({
                    manager: true
                })
            }

            return res.id;
        } catch (error) {
            console.log('Error @addManager', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
            return false
        }
    }

    const getManagers = async (userId) => {
        try {
            console.log('Gettings AMs')
            if (!userId) return;
            setManagersLoading()
            const data = []
            await db.collection('managers').doc(userId).collection('managers').onSnapshot(doc => {
                return doc.forEach(ref => {
                    if (ref.exists) {
                        data.push({ id: ref.id, ...ref.data() })
                    }
                })
            })

            dispatch({ type: GET_MANAGERS, payload: data })
        } catch (error) {
            console.log('Error @getManagers', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
        }
    }

    const setManagersLoading = () => dispatch({ type: MANAGER_LOADING })

    return (
        <ManagersContext.Provider value={{
            managers: state.managers,
            manager: state.manager,
            error: state.error,
            loading: state.loading,
            addManager,
            getManagers,
        }}>
            {children}
        </ManagersContext.Provider>
    )

}


export default ManagersState