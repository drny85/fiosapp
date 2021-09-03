import React, { useReducer } from "react"
import notesReducer from "./notesReducer"
import NotesContext from './notesContext'
import { db } from "../../database"
import moment from 'moment'
import { ADD_NOTE, GET_NOTES, NOTE_ERROR } from "./notesTypes"

const NotesState = ({ children }) => {

    const initialState = {
        notes: [],
        note: null,
        error: null,
        loadingNotes: false
    }

    const [state, dispatch] = useReducer(notesReducer, initialState)

    const addNote = async (note) => {
        try {
            const result = await db.collection('notes').doc(note.userId).collection('notes').add(note)
            return true
        } catch (error) {
            console.log('Error @addNote', error)
            //dispatch({ type: NOTE_ERROR, payload: error })
            return false
        }

    }

    const getNotes = async (userId) => {
        try {

            await db.collection('notes').doc(userId).collection('notes').orderBy('addedOn', 'desc').onSnapshot(notes => {
                const data = [];
                notes.forEach(n => {
                    if (n.exists) {
                        data.push({ id: n.id, ...n.data() })
                    }
                })
                dispatch({ type: GET_NOTES, payload: data })
                return true
            })


        } catch (error) {
            console.log('error @gettingNotes')
            return false
        }
    }

    const deleteNote = async (note) => {
        try {
            await db.collection('notes').doc(note.userId).collection('notes').doc(note.id).delete()
            return true
        } catch (error) {
            throw new Error(error.message)
        }
    }

    const updateNote = async (note) => {
        try {

            await db.collection('notes').doc(note.userId).collection('notes').doc(note.id).update(note)
            return true;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    const deleteOrderNotes = async (userId) => {
        try {
            console.log(userId)
            // const ref = await db.collection('notes').doc(userId).collection('notes').get()
            // ref.data().forEach(n => {
            //     if (moment(n.addedOn).isBefore(moment().add(1, 'month'))) {
            //         console.log(n.addedOn)
            //     }
            // })


        } catch (error) {
            console.log(error.message)
        }
    }



    return <NotesContext.Provider value={{
        notes: state.notes,
        note: state.note,
        loadingNotes: state.loadingNotes,
        error: state.error,
        addNote,
        deleteNote,
        updateNote,
        getNotes,
        deleteOrderNotes
    }}>
        {children}
    </NotesContext.Provider>

}


export default NotesState