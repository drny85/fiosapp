import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import ScreenView from '../ScreenView'

import { Input, Button, Image } from 'react-native-elements'
import { Platform } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { Feather } from '@expo/vector-icons'
import { auth } from '../../database'
import { useNavigation } from '@react-navigation/native'
import authContext from '../../context/auth/authContext'
import Loader from '../../components/Loader'
import { TouchableOpacity } from 'react-native-gesture-handler'

import LottieView from 'lottie-react-native';
import DismissKeyboard from '../../components/DismissKeyboard'



const Signin = ({ route }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
