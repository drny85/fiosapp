import React, { useReducer } from 'react'
import { auth, db } from '../../database'

import AuthContex from './authContext'
import authReducer from './authReducer'
import { SIGN_OUT, USER_ERROR, CLEAR_ERROR, SIGN_IN, USER_LOADING } from './authTypes'

const AuthState = ({ children }) => {
    const initialState = {
        user: null,
        loading: false,
        error: null
    }

    const [state, dispatch] = useReducer(authReducer, initialState)

    const signin = async ({ email, password }) => {
        try {
            return await auth.signInWithEmailAndPassword(email, password)
        } catch (error) {
            console.log('Error @signin state', error)
            dispatch({ type: USER_ERROR, payload: error.message })
            return false
        }
    }

    const logout = async () => {
        try {

            await auth.signOut()
            dispatch({ type: SIGN_OUT })
            return true
        } catch (error) {
            console.log('Error logging out', error.message)
            dispatch({ type: USER_ERROR, payload: error.message })
        }
    }

    const signup = async (email, password) => {
        try {
            if (!email || !password) return;
            return await auth.createUserWithEmailAndPassword(email, password)
        } catch (error) {
            console.log('Error signing up', error.message)
            dispatch({ type: USER_ERROR, payload: error.message })
        }
    }

    const clearAuthError = () => dispatch({ type: CLEAR_ERROR })

    const sendVerificationEmail = async () => {
        try {

            const user = await auth.currentUser;
            user.sendEmailVerification()
            console.log('Email Verifocation Sent')
            return true
        } catch (error) {
            console.log('Error @sendConfirmationEmail', error.message)
            return false
        }
    }

    const createUser = async (userInfo) => {
        try {

            const user = await db.collection('users').doc(userInfo.userId).set(userInfo)

            const res = await db.collection('users').doc(userInfo.userId).get();

            return true
        } catch (error) {
            console.log("Error @createUser", error.message)
            return false
        }
    }

    const setUser = async (userId) => {
        try {
            dispatch({ type: USER_LOADING })
            const user = await db.collection('users').doc(userId).get()
            if (user.exists) {
                dispatch({ type: SIGN_IN, payload: { id: user.id, ...user.data() } })
            }

        } catch (error) {
            console.log('Error @setUser', error.message)
        }
    }


    return (
        <AuthContex.Provider value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            signin,
            signup,
            logout,
            clearAuthError,
            sendVerificationEmail,
            createUser,
            setUser,
        }}>
            {children}
        </AuthContex.Provider>
    )

}



export default AuthState