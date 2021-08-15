import React, { useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import notesContext from '../../context/notes/notesContext'
import ScreenView from '../ScreenView'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import InputTextField from '../../components/InputTextField'
import moment from 'moment'
import { useTodayNotes } from '../../hooks/useTodayNotes'
import { useNavigation } from '@react-navigation/native'
import { scheduleMotification } from '../../hooks/scheduleNotification'
import DateTimePicker from '@react-native-community/datetimepicker';


const todo = {
    text: '',
    completed: false,
    time: moment(new Date()).add(8, 'seconds')
}

const TodoCard = ({ note }) => {
    return (
        <TouchableOpacity style={{
            padding: SIZES.padding * 0.5,
            backgroundColor: COLORS.white,
            shadowOffset: { width: 6, height: 6 },
            shadowColor: COLORS.lightGray,
            shadowOpacity: 0.7,
            shadowRadius: 10,
            elevation: 8,
            marginHorizontal: 5,
            marginVertical: 4,
            borderRadius: SIZES.radius,
            justifyContent: 'space-between'
        }}>
            <Text style={{ ...FONTS.body4 }}>{todo.text}</Text>
            <Text style={{ fontSize: 16, fontStyle: 'italic', textAlign: 'right', marginTop: 10 }}>--{moment(todo.time).format('lll')}</Text>
        </TouchableOpacity>
    )
}

const Todos = () => {
    const { user } = useContext(authContext)
    const [visible, setVisible] = useState(false)
    const { addNote } = useContext(notesContext)
    const [todoData, setTodoData] = useState('')
    const navigation = useNavigation()

    const notes = useTodayNotes()



    const saveTodo = async () => {
        if (todoData.length < 5) {
            alert('Todo is too short or empty')
            return
        }
        try {
            const added = await addNote({ userId: user.id, text: todoData, addedOn: new Date().toISOString() })
            if (added) {
                setVisible(false)
                setTodoData('')
            }
        } catch (error) {
            console.log(error)
        }


    }
    useEffect(() => {
        scheduleMotification('New Not', 'let check this out', todo.time)
    }, [todo.time])

    return (
        <ScreenView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='ios-arrow-back' size={28} />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Today's ToDos</Text>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <AntDesign name='plus' size={28} />
                </TouchableOpacity>
            </View>
            {notes.length > 0 ? (
                <FlatList data={notes} keyExtractor={item => item.id} contentContainerStyle={{ marginTop: SIZES.padding }} renderItem={({ item }) => <TodoCard note={item} />} />
            ) : <View style={{ height: SIZES.height * 0.8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4 }}>No Notes</Text>
                </View>}

            <Modal animationType='slide' visible={visible}>
                <View style={{ flex: 1, marginTop: SIZES.statusBarHeight }}>
                    <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.light, position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 10, left: 15, zIndex: 50 }} onPress={() => setVisible(false)}>
                        <Ionicons name='close' size={26} color={COLORS.black} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 80, width: SIZES.width * 0.95, alignSelf: 'center', marginTop: SIZES.padding * 3 }}>
                        <InputTextField multiline={true} autoCorrect={false} placeholder='Type your ToDo' value={todoData} onChangeText={text => setTodoData(text)} />
                    </View>
                    <View>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: SIZES.padding * 2 }}>
                        <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center', width: SIZES.width / 3, alignItems: 'center', borderRadius: SIZES.radius * 3, alignSelf: 'center', shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.white }} onPress={() => setNoteData('')}>
                            <Text style={{ ...FONTS.h4 }}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center',
                            alignItems: 'center', width: SIZES.width / 3, borderRadius: SIZES.radius * 3, alignSelf: 'center',
                            shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.tile
                        }}
                            onPress={saveTodo}>
                            <Text style={{ ...FONTS.h4 }}>Save Todo</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </Modal>

        </ScreenView>
    )
}

export default Todos

const styles = StyleSheet.create({
    view: {
        height: SIZES.height,
        backgroundColor: COLORS.background

    }
})
