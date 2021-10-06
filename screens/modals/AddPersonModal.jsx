import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Modal } from 'react-native'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox'

import ButtonsTop from '../../components/ButtonsTop'
import { SIZES, COLORS, FONTS } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import coachContext from '../../context/coach/coachContext'
import managersContext from '../../context/manager/managersContext'
import refereesContext from '../../context/referee/refereesContext'
import { formatPhone } from '../../utils/formatPhone'
import InputTextField from '../../components/InputTextField'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { isEmailValid } from '../../utils/isEmailValide'
import { useNavigation } from '@react-navigation/native'


const AppPersonModal = ({ visible, person, setVisible, selected, editing, setEditing }) => {
    const navigation = useNavigation()
    const { addManager, updateManager, deleteManager } = useContext(managersContext)
    const { addReferee, updateReferee, deleteReferee } = useContext(refereesContext)
    const { addCoach, coachs, error } = useContext(coachContext)
    const { user, setUser } = useContext(authContext)
    const [manager, setManager] = useState(false)
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [property, setProperty] = useState('')
    const [coach, setCoach] = useState(false)
    const [referee, setReferee] = useState(false)
    const [busy, setBusy] = useState(false)
    const [alertError, setAlertError] = useState(null)

    const handleSubmit = useCallback(async () => {

        try {

            if (name.length < 5) {
                alert('Full name is required')
                return
            } else if (phone < 12) {
                alert('Phone is invalid')
                return
            }
            else if (!isEmailValid(email)) {
                alert('Email is invalid')
                return;
            }
            const data = {
                property: property !== '' ? property : null,
                userId: user.userId,
                name: name,
                email: email,
                role: selected,
                addedOn: new Date().toISOString(),
                phone: phone,
                partners: { manager: user.manager, coach: user.coach },

            }


            setBusy(true)
            if (selected === 'manager' || manager) {
                let res;
                if (editing && person) {
                    data.id = person.id
                    res = await updateManager(data)

                } else {
                    res = await addManager(data)
                }
                if (res) {

                    setEditing(false)
                    setVisible(false)

                }
            } else if (selected === 'referee' || referee) {
                let res;
                if (editing && person) {
                    data.id = person.id

                    res = await updateReferee(data)

                } else {
                    res = await addReferee(data)
                }


                if (res) {
                    setEditing(false)
                    setVisible(false)

                }
            } else if (selected === 'coach' || coach) {
                // values.partners = { manager: user.manager, coach: user.coach };

                const res = await addCoach(data)
                if (error) {
                    alert(error)
                    setVisible(false)
                    return
                }

                if (res) {
                    setEditing(false)
                    setVisible(false)
                }
            }
        } catch (error) {
            console.log('Error @AppPersonModal/HandleSubmit', error.message)
        } finally {
            setBusy(false)
            setUser(user.id)
        }


    })

    useEffect(() => {
        switch (selected) {
            case 'manager':
                setManager(true)
                setReferee(false)
                setCoach(false)
                break;
            case 'referee':
                setManager(false)
                setCoach(false)
                setReferee(true)
                break;
            case 'coach':
                setManager(false)
                setReferee(false)
                setCoach(true)
                break;
            default:
                break;
        }
        if (person && editing) {
            setName(person.name)
            setEmail(person.email)
            setPhone(person.phone)
            setProperty(person.property)
        }

        return () => setVisible(false)

    }, [selected, editing])
    return (
        <Modal visible={visible}>
            <ScrollView contentContainerStyle={styles.view} >

                <ButtonsTop text='Add a Manager or Coach' canGoBack={false} iconRightName='close' onPress={() => {
                    setEditing(false)
                    setVisible(false)
                }} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.form}>
                    <View>
                        <InputTextField name='name' value={name} placeholder='Full Name' autoCapitalize='words' onChangeText={text => setName(text)} />
                        <InputTextField name='phone' value={phone} placeholder='Phone' keyboardType="numeric" maxLength={14} onChangeText={text => setPhone(formatPhone(text))} />
                        <InputTextField name='email' value={email} onChangeText={text => setEmail(text)} placeholder='Email Address' textContentType="emailAddress" keyboardType='email-address' autoCapitalize="none" autoCorrect={false} />

                        <View style={styles.checkbox}>
                            <CheckBox containerStyle={{ paddingHorizontal: 10, backgroundColor: 'transparent' }} checkedColor={COLORS.secondary} title='Manager' checked={manager} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(true); setCoach(false); setReferee(false) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />

                            <CheckBox containerStyle={{ backgroundColor: 'transparent' }} checkedColor={COLORS.secondary} title='Referee' checked={referee} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(false); setCoach(false); setReferee(true) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />
                            <CheckBox containerStyle={{ backgroundColor: 'transparent', paddingHorizontal: 10 }} checkedColor={COLORS.secondary} title='Coach' checked={coach} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(false); setCoach(true); setReferee(false) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />
                        </View>
                        {referee && (<InputTextField name="property" value={property} onChangeText={text => setProperty(text)} placeholder="Property's Name - (optional)" />)}

                        <TouchableOpacity disabled={busy} style={[styles.button, { opacity: busy ? 0.4 : 1 }]} onPress={handleSubmit} >
                            <Text style={{ ...FONTS.h4, color: COLORS.lightText }}>
                                {!editing ? 'SAVE' : 'UPDATE'}

                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Modal>
    )
}

export default AppPersonModal

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: SIZES.statusBarHeight + 20,
        alignItems: 'center'

    },
    form: {
        width: '90%',
        marginTop: 30
    },
    checkbox: {
        flexDirection: 'row',

        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 4,


    },
    button: {
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: SIZES.padding * 0.5,
        paddingHorizontal: SIZES.padding * 2,
        backgroundColor: COLORS.card,
        shadowColor: COLORS.ascent,
        shadowOffset: { width: 8, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 8,
        borderRadius: SIZES.radius * 3
    }
})
