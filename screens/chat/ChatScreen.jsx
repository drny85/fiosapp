import React, { useContext, useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import moment from 'moment'
import authContext from '../../context/auth/authContext';
import firebase from 'firebase'
import { db } from '../../database';
import Loader from '../../components/Loader';
import Message from '../../components/Message';




const ChatScreen = () => {
    const { user } = useContext(authContext)
    const viewRef = useRef()
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const sendMessage = () => {
        try {
            if (message === '') return
            const msg = {
                sender: { id: user?.id, name: user?.name },
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                body: message
            }
            db.collection('messages').add(msg)
            setMessage('')
            //viewRef.current?.scrollToEnd({ animated: true })
        } catch (error) {
            alert(error.message)
        }
    }


    useEffect(() => {

        const uns = db.collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        //viewRef.current?.scrollToEnd({ animated: true })

        return uns;
    }, [user])


    if (!user) return <Loader />


    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                {messages.length > 0 ? (<FlatList onContentSizeChange={(w, h) => { viewRef.current.scrollToEnd({ animated: true }) }} ref={viewRef} contentContainerStyle={{ marginBottom: 25 }} data={messages} keyExtractor={item => item.id} renderItem={({ item }) =>
                    <Message key={item.id} userId={user.id} sender={item?.sender} message={item.body} timeStamp={moment(item.timestamp?.toDate()).fromNow()} />} />) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ ...FONTS.body3 }}>No Messages</Text>
                        </View>
                    )}




                <View style={styles.input}>
                    <TextInput multiline returnKeyType='send' value={message} onChangeText={text => setMessage(text)} style={{ alignItems: 'center', flex: 1, paddingLeft: 10, ...FONTS.body3, justifyContent: 'center' }} placeholder='Type your message' placeholderTextColor={COLORS.lightGray} />
                    <TouchableOpacity disabled={message.length < 2} onPress={sendMessage} style={{ paddingHorizontal: 5 }}>
                        <MaterialIcons name="send" size={34} color={COLORS.blue} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: COLORS.background

    },

    input: {


        borderRadius: SIZES.radius * 3,
        borderWidth: 0.5,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 20,
        marginVertical: SIZES.padding * 0.5,
        marginHorizontal: 10,
        flexDirection: 'row',
        width: SIZES.width * 0.98,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',



    },

})
