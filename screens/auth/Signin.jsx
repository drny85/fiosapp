import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import ScreenView from '../ScreenView'

import { Input, Button, Image } from 'react-native-elements'
import { Platform } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { Feather } from '@expo/vector-icons'
import { auth } from '../../database'
import { useNavigation } from '@react-navigation/native'
import authContext from '../../context/auth/authContext'
import Loader from '../../components/Loader'


const Signin = ({ route }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { error, setUser, loading } = useContext(authContext)

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
            }
        } catch (error) {
            console.log(error.message)
            alert(error.message)


        }
    }


    useEffect(() => {
        if (preview) {
            setEmail(preview)
        }
    }, [route.params])

    if (loading) return <Loader />
    return (
        <ScreenView>
            <KeyboardAvoidingView style={styles.view} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/verizon-logo.png')} style={{ width: SIZES.width / 3, height: 100, resizeMode: 'cover' }} />
                </View>
                <View style={{ width: '100%' }}>
                    <Input placeholder='Email Address' keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={text => setEmail(text.trim().toLowerCase())} />
                    <Input rightIcon={<Feather name="eye" size={24} color="black" />} placeholder='Password' secureTextEntry={true} value={password} onChangeText={text => setPassword(text.trim())} />
                </View>
                <View style={{ marginTop: 30 }}>
                    <Button type='outline' buttonStyle={{ borderColor: COLORS.secondary, backgroundColor: COLORS.primary }} style={{ width: SIZES.width / 3, }} titleStyle={{ color: COLORS.secondary }} raised title='Sign In' onPress={singinHandler} />
                </View>

                <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4 }}>Do not have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>Sign Up!</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

        </ScreenView>
    )
}

export default Signin

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginHorizontal: SIZES.padding * 0.5
    }
})
