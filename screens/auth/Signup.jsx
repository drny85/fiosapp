import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView } from 'react-native'


import { Input, Image } from 'react-native-elements'
import { COLORS, SIZES, FONTS } from '../../constants/contantts'
import { Feather } from '@expo/vector-icons'
import authContext from '../../context/auth/authContext'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import DismissKeyboard from '../../components/DismissKeyboard'
import { isADrascoEmail } from '../../utils/isEmailValide'


const Signup = ({ navigation }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(true)
    const emailRef = useRef()

    const { signup, error, clearAuthError, sendVerificationEmail, createUser } = useContext(authContext)

    const formatedPhone = (p) => {

        if (p.length === 3) {
            p += '-'
        } else if (p.length === 7) {
            p += '-'
        } else if (p.length >= 12) {
            emailRef.current.focus()
        }

        return p;
    }

    const clearForm = () => {

        setPassword('')
        setConfirm('')
        navigation.replace('Success', { email })
    }

    const signupHandler = async () => {
        try {
            if (name === '' || phone === '' || name.split(' ').length !== 2) {
                alert('Full Name and phone are required')
                return
            }
            else if (email === '' || password === '') {
                alert('Email & password are required')
                return
            } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                alert('Invalid Email')
                return
            } else if (password.length < 6) {
                alert('Password must be at least 6 characters')
                return
            }
            else if (
                password !== confirm
            ) {
                alert('Password must match')
                return
            }

            const isValid = isADrascoEmail(email)
            if (!isValid) {
                alert('Invalid domain. Only drascosales.com emails')
                return
            }

            const data = await signup(email, password)
            if (!data) return


            const created = await createUser({ userId: data.user.uid, name: name.trim(), email, phone, manager: null, coach: null, vendor: null, title: null, addedOn: new Date().toISOString(), imageUrl: null, roles: { admin: false, active: true, coach: false } })
            if (created) {

                const sent = await sendVerificationEmail()
                if (sent) {
                    clearForm()

                }


            } else if (error) {
                alert(error)
                clearAuthError()
            }
        } catch (error) {
            console.log(error)

            alert(error.message)
        }
    }

    return (

        <DismissKeyboard style={{ backgroundColor: '#fff' }}>
            <KeyboardAvoidingView style={styles.view} keyboardVerticalOffset={60} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 20, }}>
                    <Image source={{ uri: 'http://www.drascosales.com/Drasco_Logo.jpg' }} style={{ width: SIZES.width * 0.7, height: 100, resizeMode: 'cover' }} />
                </View>
                <View style={{ width: '100%' }}>
                    <Input autoCapitalize='words' autoCompleteType='name' placeholder='Full Name' value={name} onChangeText={text => setName(text)} />
                    <Input autoCapitalize='none' autoCompleteType='tel' keyboardType='numeric' placeholder='Work Phone' value={phone} onChangeText={text => setPhone(formatedPhone(text.trim()))} />
                    <Input ref={emailRef} autoCapitalize='none' autoCompleteType='email' keyboardType='email-address' placeholder='Email Address' value={email} onChangeText={text => setEmail(text.trim().toLowerCase())} />
                    <Input autoCapitalize='none' textContentType='password' autoCorrect={false} rightIcon={<TouchableWithoutFeedback onPress={() => {
                        setShow(prev => !prev)

                    }}>
                        <Feather name={show ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableWithoutFeedback>} placeholder='Password' secureTextEntry={show} value={password} onChangeText={text => setPassword(text.trim())} />
                    <Input autoCapitalize='none' textContentType='password' rightIcon={<TouchableWithoutFeedback onPress={() => setShow(show ? false : true)}>
                        <Feather name={show ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableWithoutFeedback>} placeholder='Confirm Password' secureTextEntry={show} value={confirm} onChangeText={text => setConfirm(text.trim())} />
                </View>
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity style={styles.btn} onPress={signupHandler}>
                        <Text style={{ ...FONTS.h3, color: COLORS.lightText }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4 }}>Have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>Sign In!</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </DismissKeyboard>


    )
}

export default Signup

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        backgroundColor: '#fff',

        width: '100%',
        marginHorizontal: SIZES.padding * 0.5,

    },
    btn: {
        backgroundColor: COLORS.card,
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
    }
})
