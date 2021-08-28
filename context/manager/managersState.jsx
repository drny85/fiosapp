import React, { useReducer } from 'react'
import { db } from '../../database'

import ManagersContext from './managersContext'
import managersReducer from './managersReducer'
import { GET_MANAGERS, MANAGER_ERROR, MANAGER_LOADING, RESET_MANAGERS } from './managersTypes'

const ManagersState = ({ children }) => {
    const initialState = {
        managers: [],
        manager: null,
        error: null,
        loadingManagers: false
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

    const updateManager = async (manager) => {
        try {

            const res = db.collection('maangers').doc(manager.userId).collection('managers').doc(manager.id).update(manager)
            return true
        } catch (error) {
            console.log('Error @updateManager', error)
            dispatch({ type: MANAGER_ERROR, payload: error.message })
            return false
        }
    }
    const deleteManager = async (manager) => {
        try {

            const res = db.collection('maangers').doc(manager.userId).collection('managers').doc(manager.id).delete()
            return true
        } catch (error) {
            console.log('Error @deleteManager', error)
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
    const resetManagerState = () => dispatch({ type: RESET_MANAGERS })

    const setManagersLoading = () => dispatch({ type: MANAGER_LOADING })

    return (
        <ManagersContext.Provider value={{
            managers: state.managers,
            manager: state.manager,
            error: state.error,
            loadingManagers: state.loadingManagers,
            addManager,
            getManagers,
            resetManagerState,
            updateManager,
            deleteManager
        }}>
            {children}
        </ManagersContext.Provider>
    )

}


export default ManagersState