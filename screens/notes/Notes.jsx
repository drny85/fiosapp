import React, { useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import notesContext from '../../context/notes/notesContext'
import ScreenView from '../ScreenView'
import { Ionicons } from '@expo/vector-icons'
import InputTextField from '../../components/InputTextField'
import moment from 'moment'
import { useTodayNotes } from '../../hooks/useTodayNotes'

const NoteCard = ({ note }) => {
    return (
        <TouchableOpacity style={{
            padding: SIZES.padding * 0.5,
            backgroundColor: COLORS.white,
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
            <Text style={{ ...FONTS.body4 }}>{note.text}</Text>
            <Text style={{ fontSize: 10, fontStyle: 'italic', textAlign: 'right', marginTop: 10 }}>--{moment(note.addedOn).format('lll')}</Text>
        </TouchableOpacity>
    )
}

const Notes = () => {
    const { user } = useContext(authContext)
    const [visible, setVisible] = useState(false)
    const { addNote } = useContext(notesContext)
    const [noteData, setNoteData] = useState('')

    const notes = useTodayNotes()


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

    return (
        <ScreenView>
            <ButtonsTop canGoBack={false} iconRightName='plus' onPress={() => setVisible(true)} />

            <View style={styles.view}>
                <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Today's Notes</Text>
                {notes.length > 0 ? (
                    <FlatList data={notes} keyExtractor={item => item.id} renderItem={({ item }) => <NoteCard note={item} />} />
                ) : <View style={{ height: SIZES.height * 0.8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.body4 }}>No Notes</Text>
                    </View>}

            </View>

            <Modal animationType='slide' visible={visible}>
                <View style={{ flex: 1, marginTop: SIZES.statusBarHeight }}>
                    <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.light, position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 10, left: 15, zIndex: 50 }} onPress={() => setVisible(false)}>
                        <Ionicons name='close' size={26} color={COLORS.black} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 80, width: SIZES.width * 0.95, alignSelf: 'center' }}>
                        <InputTextField multiline={true} autoCorrect={false} placeholder='Type your note' value={noteData} onChangeText={text => setNoteData(text)} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                        <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', width: SIZES.width / 3, alignItems: 'center', borderRadius: SIZES.radius * 3, alignSelf: 'center', shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.white }} onPress={() => setNoteData('')}>
                            <Text style={{ ...FONTS.h4 }}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', alignItems: 'center', width: SIZES.width / 3, borderRadius: SIZES.radius * 3, alignSelf: 'center', shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.tile }} onPress={saveNote}>
                            <Text style={{ ...FONTS.h4 }}>Save Note</Text>
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

    }
})
