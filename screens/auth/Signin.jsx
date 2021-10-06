import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable } from 'react-native'
import ScreenView from '../ScreenView'

import { Input, Button, Image } from 'react-native-elements'
import { Platform, Modal } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { Feather } from '@expo/vector-icons'
import { auth } from '../../database'
import { useNavigation } from '@react-navigation/native'
import authContext from '../../context/auth/authContext'
import Loader from '../../components/Loader'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Animatable from 'react-native-animatable'

import LottieView from 'lottie-react-native';
import DismissKeyboard from '../../components/DismissKeyboard'
import { AntDesign } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import { isEmailValid } from '../../utils/isEmailValide'



const Signin = ({ route }) => {
    const [email, setEmail] = useState('')
    const [emailReset, setEmailReset] = useState('')
    const [password, setPassword] = useState('')
    const [resetPassword, setResetPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const { setUser, loading } = useContext(authContext)
    const [processing, setProcessing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const preview = route.params?.previewEmail
    const navigation = useNavigation()

    const singinHandler = async () => {
        try {
            if (email === '' || password === '') {
                alert('Both fields are required')
                return
            } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                alert('Invalid Email')
                return
            }

            const { user } = await auth.signInWithEmailAndPassword(email, password)


            if (!user.emailVerified) {
                alert('You must verify your email first')

                return
            } else if (user.emailVerified) {
                setUser(user.uid)
                // setProcessing(true)

                console.log('LOGGED IN')

            }
        } catch (error) {
            console.log(error.message)
            alert(error.message)


        }
    }

    const handleResetPassword = async () => {
        try {
            if (emailReset.length < 6) {
                alert('Password must be at least 6 characters long')
                return
            }
            if (!isEmailValid(emailReset)) {
                alert('Invalid email')
                return
            }
            await auth.sendPasswordResetEmail(emailReset)
            setSuccess(true)
            //setResetPassword(false)
        } catch (error) {
            console.log(error.message)
        }
    }


    if (loading) return <Loader />

    return (
        <ScreenView>
            <DismissKeyboard>
                {processing ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView loop={false} source={require('../../assets/animations/welcome.json')} onAnimationFinish={() => {
                            setProcessing(false)
                            setUser(user.uid)
                        }} />
                    </View>
                ) : (
                        <KeyboardAvoidingView style={styles.view} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                            <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={require('../../assets/verizon-logo.png')} style={{ width: SIZES.width / 3, height: 100, resizeMode: 'cover', marginBottom: 120 }} />
                            </View>
                            <View style={{ width: '100%' }}>
                                <Input placeholder='Email Address' keyboardType='email-address' autoCorrect={false} autoCapitalize='none' value={email} onChangeText={text => setEmail(text.trim().toLowerCase())} />
                                <Input rightIcon={<Feather name={!showPassword ? 'eye' : 'eye-off'} size={24} onPress={() => setShowPassword(!showPassword)} color="black" />} placeholder='Password' secureTextEntry={!showPassword} value={password} onChangeText={text => setPassword(text.trim())} />
                                <TouchableOpacity onPress={() => setResetPassword(true)} style={{ marginRight: 10 }}>
                                    <Text style={{ textAlign: 'right', color: COLORS.blue }}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <TouchableOpacity style={styles.btn} onPress={singinHandler}>
                                    <Text style={{ ...FONTS.h3, color: COLORS.lightText }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Text style={{ ...FONTS.body4 }}>Do not have an account??</Text>

                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>Sign Up!</Text>
                                </TouchableOpacity>
                            </View>
                            <Modal visible={resetPassword} animationType='slide'>
                                <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                                    <Pressable onPress={() => setResetPassword(false)} style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 30, top: 80, zIndex: 999, width: 50, height: 50, elevation: 8, borderRadius: 25, backgroundColor: COLORS.light }}>
                                        <AntDesign name='close' size={24} />
                                    </Pressable>
                                    {!success && (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <TextInput value={emailReset} placeholder='Email Address' onChangeText={text => setEmailReset(text.toLowerCase().trim())} keyboardType='email-address' autoCapitalize='none' autoCorrect={false} style={{ paddingHorizontal: 12, paddingVertical: 8, ...FONTS.body4, backgroundColor: COLORS.light, width: '90%', borderRadius: 25, height: 50 }} />
                                            <Pressable onPress={handleResetPassword} style={{ marginVertical: 25, backgroundColor: COLORS.secondary, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25 }}>
                                                <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Reset Password</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                    {success && (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Animatable.Text animation='fadeInDown' duration={600} style={{ ...FONTS.h2, }}>
                                                Success!
                                            </Animatable.Text>
                                            <Animatable.Text animation='slideInUp' duration={600} style={{ marginVertical: 30, ...FONTS.body3, lineHeight: 30 }}>
                                                If an account with {emailReset} exists, please check your email.
                                            </Animatable.Text>
                                            <Pressable onPress={() => {
                                                setEmailReset('')
                                                setResetPassword(false)
                                                setSuccess(false)

                                            }} style={{ marginVertical: 25, backgroundColor: COLORS.secondary, paddingVertical: 15, paddingHorizontal: 35, borderRadius: 25 }}>
                                                <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Got It!</Text>
                                            </Pressable>
                                        </View>
                                    )}


                                </View>

                            </Modal>

                        </KeyboardAvoidingView>
                    )}

            </DismissKeyboard>
        </ScreenView>
    )
}

export default Signin

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        maxWidth: 600,
        paddingHorizontal: 10,
        alignSelf: 'center',
        width: '100%',
        marginHorizontal: SIZES.padding * 0.5
    }, btn: {
        backgroundColor: COLORS.card,
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
    }
})
