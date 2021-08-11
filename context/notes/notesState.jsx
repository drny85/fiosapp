import React, { useReducer } from "react"
import notesReducer from "./notesReducer"
import NotesContext from './notesContext'
import { db } from "../../database"
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



    return <NotesContext.Provider value={{
        notes: state.notes,
        note: state.note,
        loadingNotes: state.loadingNotes,
        error: state.error,
        addNote,
        getNotes
    }}>
        {children}
    </NotesContext.Provider>

}


export default NotesState