import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Animated } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext';
import firebase from 'firebase'
import { db } from '../../database';
import Loader from '../../components/Loader';
import Message from '../../components/Message';



const ChatScreen = () => {
    const { user } = useContext(authContext)
    const valueY = useState(new Animated.Value(0))[0]
    const opacity = useState(new Animated.Value(0))[0]
    const viewRef = useRef()
    const inputRef = useRef()
    const ref = useRef()
    const [isReplying, setIsReplying] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [opened, setOpened] = useState(null)
    const [msg, setMsg] = useState({})
    let rowRefs = new Map();

    const sendMessage = () => {
        try {
            if (message === '') return
            const data = {
                sender: { id: user?.id, name: user?.name },
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                body: message,
                isReplied: isReplying ? isReplying : false,
                reply: isReplying ? msg : null
            }

            db.collection('messages').add({ ...data })
            setMessage('')
            setIsReplying(false)
            rowRefs.get(opened)?.close()
            //viewRef.current?.scrollToEnd({ animated: true })
        } catch (error) {
            alert(error.message)
        }
    }

    const onDeleteMessage = async (id, userId) => {
        try {
            const canDelete = user.id === userId
            if (!canDelete) {
                alert('No autorized')
                return
            }
            await db.collection('messages').doc(id).delete()
        } catch (error) {
            alert(error.message)
        }
    }


    const keyboardIsUp = useCallback(({ endCoordinates }) => {
        const { height } = endCoordinates;

        Animated.timing(valueY, {
            toValue: height > 400 ? height + 35 : height,
            duration: 500,
            useNativeDriver: false
        }).start()
        Animated.timing(opacity, {
            toValue: 1,
            delay: 400,
            duration: 800,
            useNativeDriver: false
        }).start()

    }, [valueY])
    const keyboardIsDown = useCallback(({ endCoordinates }) => {
        const { screenX } = endCoordinates;

        Animated.timing(valueY, {
            toValue: screenX + 60,
            duration: 600,
            useNativeDriver: false
        }).start()
    }, [valueY])



    const onReply = useCallback((m) => {
        setMsg(m)
        inputRef.current?.focus()
        setIsReplying(true)


    }, [])

    const closeReply = useCallback(() => {
        setIsReplying(false)
        rowRefs.get(opened)?.close()
        Keyboard.dismiss()
    }, [])

    useEffect(() => {
        const keyboardListener = Keyboard.addListener('keyboardWillShow', keyboardIsUp)
        const keyboardListener2 = Keyboard.addListener('keyboardWillHide', keyboardIsDown)
        const uns = db.collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        //viewRef.current?.scrollToEnd({ animated: true })

        return () => {
            uns && uns()
            keyboardListener.remove()
            keyboardListener2.remove()
        }
    }, [user])



    if (!user) return <Loader />


    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                {messages.length > 0 ? (<FlatList onContentSizeChange={(w, h) => { viewRef.current.scrollToEnd({ animated: true }) }} ref={viewRef} contentContainerStyle={{ marginBottom: 25 }} data={messages} keyExtractor={item => item.id} renderItem={({ item, index }) =>
                    <Message ref={ref => {
                        if (ref && !rowRefs.get(item.id)) {
                            rowRefs.set(item.id, ref)
                        }
                    }} onSwipeableWillOpen={() => {
                        setOpened(item.id);
                        [...rowRefs.entries()].forEach(([key, ref]) => {
                            if (key !== item.id && ref) ref.close();
                        });
                    }} key={item.id} onReply={() => onReply(item)} msgBody={item} onClose={() => setIsReplying(false)} onDelete={() => onDeleteMessage(item.id, item.sender.id)} userId={user.id} />} />) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ ...FONTS.body3 }}>No Messages</Text>
                        </View>
                    )}





                <View style={styles.input}>

                    <TextInput ref={inputRef} autoCorrect={false} multiline value={message} onChangeText={text => setMessage(text)} style={{ flex: 1, ...FONTS.body3, marginLeft: 10, height: '100%', justifyContent: 'center', alignSelf: 'center', paddingTop: SIZES.padding * 0.7, paddingVertical: 10 }} placeholder='Type your message' placeholderTextColor={COLORS.black} />

                    <TouchableOpacity disabled={message.length < 2} onPress={sendMessage}>
                        <MaterialIcons name="send" size={34} color={COLORS.card} />
                    </TouchableOpacity>
                </View>

                {isReplying && (
                    <Animated.View style={[styles.reply, { position: 'absolute', bottom: valueY, opacity: opacity },]}>
                        <View style={{ width: 10, position: 'absolute', left: 1, backgroundColor: COLORS.green, bottom: 1, top: 1, }} />
                        <TouchableOpacity onPress={closeReply} style={styles.close}>
                            <MaterialIcons name='close' size={24} color={COLORS.black} />
                        </TouchableOpacity>
                        <Text style={styles.replyTo}>Reply to {msg?.sender.name}</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.text, textAlign: 'left' }}>{msg.body}</Text>
                    </Animated.View>
                )}

            </KeyboardAvoidingView>
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: COLORS.light
    },

    input: {

        flexDirection: 'row',
        borderRadius: SIZES.radius * 3,
        borderWidth: 0.5,
        borderColor: COLORS.background,
        paddingHorizontal: 20,
        marginVertical: SIZES.padding * 0.5,
        marginHorizontal: 10,
        backgroundColor: COLORS.background,

        width: SIZES.width * 0.98,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',



    },
    reply: {
        backgroundColor: COLORS.background,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5, width: '95%',
        alignSelf: 'center',
        marginBottom: 4,
        borderRadius: SIZES.radius,
    },
    close: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: COLORS.tile,
        justifyContent: 'center',
        position: 'absolute',
        alignItems: 'center',
        right: -5,
        top: -10,
    },
    replyTo: {
        ...FONTS.body4,
        position: 'absolute',

        left: 0,
        color: COLORS.text,
        top: -25,
    }

})
