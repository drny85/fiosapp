import React, { useState, useEffect, useContext } from 'react'
import { Modal } from 'react-native'
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox'

import * as Yup from 'yup'
import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import AppSubmitButton from '../../components/AppSubmitButton'
import ButtonsTop from '../../components/ButtonsTop'
import { SIZES, COLORS, FONTS } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import coachContext from '../../context/coach/coachContext'
import managersContext from '../../context/manager/managersContext'
import refereesContext from '../../context/referee/refereesContext'
import { formatPhone } from '../../utils/formatPhone'

const formSchema = Yup.object().shape({
    name: Yup.string().required().label('Full name'),
    email: Yup.string().email().required().label('Email')
})


const AppPersonModal = ({ visible, setVisible, selected }) => {
    const { addManager } = useContext(managersContext)
    const { addReferee } = useContext(refereesContext)
    const { addCoach, coachs, error } = useContext(coachContext)
    const { user } = useContext(authContext)
    const [manager, setManager] = useState(false)
    const [phone, setPhone] = useState('')
    const [coach, setCoach] = useState(false)
    const [referee, setReferee] = useState(false)
    const [alertError, setAlertError] = useState(null)

    const handleSubmit = async (values) => {
        try {
            values.property = values.property === '' ? null : values.property;
            values.userId = user.userId;
            values.phone = phone
            values.addedOn = new Date().toISOString()
            if (selected === 'manager' || manager) {
                values.partners = { manager: user.manager, coach: user.coach };
                const res = await addManager(values)
                if (res) {
                    console.log(res)
                    setVisible(false)
                }
            } else if (selected === 'referee' || referee) {
                const res = await addReferee(values)
                if (res) {
                    console.log(res)
                    setVisible(false)
                }
            } else if (selected === 'coach' || coach) {
                values.partners = { manager: user.manager, coach: user.coach };

                const res = await addCoach(values)

                if (error) {
                    alert(error)
                    setVisible(false)
                    return
                }

                if (res) {

                    setVisible(false)
                }
            }
        } catch (error) {
            console.log('Error @AppPersonModal/HandleSubmit', error.message)
        }


    }

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

    }, [selected])
    return (
        <Modal visible={visible}>
            <ScrollView contentContainerStyle={styles.view} >

                <ButtonsTop text='Add a Manager or Coach' canGoBack={false} iconRightName='close' onPress={() => setVisible(false)} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.form}>
                    <AppForm validationSchema={formSchema} initialValues={{ name: '', phone: '', email: '', property: '' }} onSubmit={handleSubmit}>
                        <AppFormField name='name' placeholder='Full Name' autoCapitalize='words' />
                        <AppFormField name='phone' value={phone} placeholder='Phone' maxLength={14} onChangeText={text => setPhone(formatPhone(text))} />
                        <AppFormField name='email' placeholder='Email Address' textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} />

                        <View style={styles.checkbox}>
                            <CheckBox containerStyle={{ paddingHorizontal: 10, backgroundColor: 'transparent' }} checkedColor={COLORS.secondary} title='Manager' checked={manager} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(true); setCoach(false); setReferee(false) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />

                            <CheckBox containerStyle={{ backgroundColor: 'transparent' }} checkedColor={COLORS.secondary} title='Referee' checked={referee} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(false); setCoach(false); setReferee(true) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />
                            <CheckBox containerStyle={{ backgroundColor: 'transparent', paddingHorizontal: 10 }} checkedColor={COLORS.secondary} title='Coach' checked={coach} textStyle={{ ...FONTS.body3 }} onPress={() => { setManager(false); setCoach(true); setReferee(false) }} checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o' />
                        </View>
                        {referee && (<AppFormField name="property" placeholder="Property's Name - (optional)" />)}

                        <AppSubmitButton style={{ marginTop: 40 }} title={`Add ${coach ? 'Coach' : manager ? 'Manager' : 'Referee'}`} />
                    </AppForm>
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


    }
})
