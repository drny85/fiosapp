import React, { useContext, useState, forwardRef } from 'react'
import { FlatList, StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Alert } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import notesContext from '../../context/notes/notesContext'
import ScreenView from '../ScreenView'
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons'
import InputTextField from '../../components/InputTextField'
import moment from 'moment'
import { useTodayNotes } from '../../hooks/useTodayNotes'
import { useNavigation } from '@react-navigation/native'
import { Swipeable } from 'react-native-gesture-handler'
import { DELETE_NOTE } from '../../context/notes/notesTypes'

const NoteCard = forwardRef(({ note, onEdit, onDelete, onSwipeableWillOpen }, ref) => {

    const rightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate(({
            inputRange: [-150, -50, 0],
            outputRange: [1, 0.5, 0],

        }))



        return (<Animated.View style={[styles.left, { transform: [{ scale }], opacity, alignSelf: 'center', paddingVertical: SIZES.padding }]}>
            <TouchableOpacity onPress={onEdit} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <Entypo name='edit' style={{ marginRight: 8 }} size={24} color={COLORS.blue} />
                <Animated.Text style={{ ...FONTS.body3 }}>edit</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name="trash" size={24} color={COLORS.red} />
                <Animated.Text style={{ color: COLORS.red, ...FONTS.h3 }}>delete</Animated.Text>
            </TouchableOpacity>

        </Animated.View>)
    }
    return (
        <Swipeable ref={ref} overshootRight={false} onSwipeableWillOpen={onSwipeableWillOpen} renderRightActions={rightActions}>
            <TouchableOpacity style={{
                padding: SIZES.padding * 0.5,
                backgroundColor: COLORS.card,
                shadowOffset: { width: 6, height: 6 },
                shadowColor: COLORS.secondary,
                shadowOpacity: 0.7,
                shadowRadius: 10,
                elevation: 8,
                marginHorizontal: 5,
                marginVertical: 4,
                borderRadius: SIZES.radius,
                justifyContent: 'space-between'
            }}>
                <Text style={{ ...FONTS.body4, color: COLORS.lightText }}>{note.text}</Text>
                <Text style={{ fontSize: 10, fontStyle: 'italic', textAlign: 'right', marginTop: 10, color: COLORS.lightText }}> {note?.updatedOn ? 'updated on:' : '--'} {note?.updatedOn ? moment(note.updatedOn).format('lll') : moment(note.addedOn).format('lll')}</Text>
            </TouchableOpacity>
        </Swipeable>
    )
})

const Notes = () => {
    const { user } = useContext(authContext)
    const [visible, setVisible] = useState(false)
    const [editing, setEditing] = useState(false)
    const [noteToUpdate, setNoteToUpdate] = useState(null)
    const { addNote, deleteNote, updateNote } = useContext(notesContext)
    const [noteData, setNoteData] = useState('')
    const navigation = useNavigation()

    const notes = useTodayNotes()

    let rowRefs = new Map()
    const saveNote = async () => {
        if (noteData.length < 5) {
            alert('Note is too short or empty')
            return
        }
        try {
            const added = await addNote({ userId: user.id, text: noteData, addedOn: new Date().toISOString() })
            if (added) {
                setVisible(false)
                setNoteData('')
            }
        } catch (error) {
            console.log(error)
        }


    }

    const handleDeleteNote = async (note) => {
        try {
            const res = await deleteNote(note)
        } catch (error) {
            console.log('Error @deleteNote', error.message)
        }
    }

    const handleUpdateNote = async (note) => {

        if (noteData.length < 5) {
            alert('Note is too short or empty')
            return
        }
        try {
            const added = await updateNote({ id: note.id, userId: user.id, text: noteData, addedOn: note.addedOn, updatedOn: new Date().toISOString() })
            if (added) {
                setVisible(false)
                setNoteData('')
                setEditing(false)
                setNoteToUpdate(null)
            }
        } catch (error) {
            console.log(error)
        }

    }
    const updatingNote = (note) => {

        setNoteData(note.text)
        setEditing(true)
        setVisible(true)
        setNoteToUpdate(note)
        rowRefs.get(note.id).close()
    }

    const handleDeleteConfirm = note => {
        Alert.alert('Delete', 'Are you sure you want to delete this note?', [{ text: 'No', style: 'cancel', onPress: () => rowRefs.get(note.id).close() }, { text: 'Yes', style: 'destructive', onPress: () => handleDeleteNote(note) }])
    }

    return (
        <ScreenView>
            <View style={styles.view}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}>
                    <Text></Text>
                    <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Today's Notes</Text>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <AntDesign name='plus' size={28} />
                    </TouchableOpacity>
                </View>
                {notes.length > 0 ? (
                    <FlatList data={notes} keyExtractor={item => item.id} contentContainerStyle={{ marginTop: SIZES.padding }} renderItem={({ item }) =>
                        <NoteCard ref={ref => {
                            if (ref && !rowRefs.get(item.id)) {
                                rowRefs.set(item.id, ref)
                            }
                        }} onSwipeableWillOpen={() => {
                            [...rowRefs.entries()].forEach(([key, ref]) => {
                                if (key !== item.id && ref) ref.close();
                            });
                        }} note={item} onDelete={() => handleDeleteConfirm(item)} onEdit={() => updatingNote(item)} />} />
                ) : <View style={{ height: SIZES.height * 0.8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.body4 }}>No Notes</Text>
                    </View>}

            </View>

            <Modal animationType='slide' visible={visible}>
                <View style={{ flex: 1, marginTop: SIZES.statusBarHeight + 50 }}>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.light, position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 10, left: 15, zIndex: 50, }} onPress={() => {
                        setEditing(false)
                        setVisible(false)
                        setNoteData('')
                    }}>
                        <Ionicons name='close' size={30} color={COLORS.black} />
                    </TouchableOpacity>
                    <View style={{ width: SIZES.width * 0.95, alignSelf: 'center', marginTop: SIZES.padding * 3 }}>
                        <InputTextField multiline={true} autoCorrect={false} placeholder='Type your note' value={noteData} onChangeText={text => setNoteData(text)} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: SIZES.padding * 2 }}>
                        <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', width: SIZES.width / 3, alignItems: 'center', borderRadius: SIZES.radius * 3, alignSelf: 'center', shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.ascent }} onPress={() => setNoteData('')}>
                            <Text style={{ ...FONTS.h4 }}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', alignItems: 'center', width: SIZES.width / 3, borderRadius: SIZES.radius * 3, alignSelf: 'center', shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.card }} onPress={editing ? () => handleUpdateNote(noteToUpdate) : saveNote}>
                            <Text style={{ ...FONTS.h4, color: COLORS.lightText }}> {editing ? 'Update Note' : 'Save Note'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </Modal>

        </ScreenView>
    )
}

export default Notes

const styles = StyleSheet.create({
    view: {
        height: SIZES.height,
        backgroundColor: COLORS.white

    },
    left: {
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-around', alignItems: 'center'
    }
})
