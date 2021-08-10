import { ADD_NOTE, GET_NOTES, DELETE_NOTE, UPDATE_NOTE, LOADING_NOTES, GET_NOTE, NOTE_ERROR } from "./notesTypes";



export default (state, { type, payload }) => {
    switch (type) {
        case GET_NOTES:
            return {
                ...state,
                notes: payload,
                loadingNotes: false
            };
        case GET_NOTE:
            return {
                ...state,
                note: payload,
                loadingNotes: false
            };
        case LOADING_NOTES:
            return {
                ...state,
                loadingNotes: true,
            }
        case DELETE_NOTE:
            return {
                ...state,
                notes: [...state.notes.filter(n => n.id !== payload)],
                loadingNotes: false
            }
        case NOTE_ERROR:
            return {
                ...state,
                error: payload,
                loadingNotes: false,
            }

        default:
            return state;
    }
}