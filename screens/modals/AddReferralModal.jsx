import React, { useContext, useState } from 'react'
import { Modal } from 'react-native'
import { StyleSheet, Text, View, TextInput, Platform, ScrollView, KeyboardAvoidingView } from 'react-native'
import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, SIZES } from '../../constants/contantts'

import * as Yup from 'yup'
import AppSubmitButton from '../../components/AppSubmitButton'
import ScreenView from '../ScreenView'
import referralsContext from '../../context/referrals/referralContext'
import authContext from '../../context/auth/authContext'



const referralSchema = Yup.object().shape({
    name: Yup.string().required().label('Full Name'),
    address: Yup.string().required().label('Address'),
    apt: Yup.string().label('Apt, Suite, Unit'),
    city: Yup.string().required().label('City'),
    zipcode: Yup.string().min(5).required().label('Zip Code'),
    state: Yup.string().required().label('State'),
    phone: Yup.string().min(10).required().label('Phone'),
    email: Yup.string().email().label('Email'),
    manager: Yup.string().required().label('AM'),
    movein: Yup.string().required().label('Move In Date'),
    referee: Yup.string().required().label('A referee')
})


const AddReferralModal = ({ visible, setVisible, onPress }) => {
    const [comment, setComment] = useState('')
    const { user } = useContext(authContext)
    const { addReferral } = useContext(referralsContext)
    const referralHandler = async (values) => {
        try {
            values.comment = comment !== '' ? comment : null;
            values.userId = user.id;

            const res = await addReferral(values)
            if (res) setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }


    return (

        <Modal animationType='slide' visible={visible}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ marginHorizontal: 10 }}>
                <ScreenView>
                    <View style={{ width: '100%', marginTop: 20, }}>
                        <ButtonsTop iconRightName='close' canGoBack={false} onPress={onPress} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ width: '100%', marginBottom: 50, }}>
                        <AppForm validationSchema={referralSchema} onSubmit={referralHandler} initialValues={{ name: '', address: '', apt: '', city: '', zipcode: '', state: '', phone: '', email: '', manager: '', movein: '', referee: '' }}>
                            <AppFormField name='name' autoFocus={true} autoCapitalize="words" autoCorrect={false} placeholder='Customer Full Name' />
                            <AppFormField name='address' autoCapitalize="words" placeholder='Address - 123 Main St' />
                            <AppFormField name='apt' autoCapitalize="words" autoCorrect={false} placeholder='Apt #, Unit, Suite' />
                            <AppFormField name='city' autoCapitalize="words" placeholder='City' />
                            <AppFormField name='state' autoCapitalize="words" placeholder='State - NY, NJ, MA' />
                            <AppFormField name='zipcode' autoCorrect={false} placeholder='Zip Code, Postal Code' />

                            <AppFormField name='phone' placeholder='Phone' />
                            <AppFormField name='email' textContentType="emailAddress" autoCapitalize="none" placeholder='Email Address' />
                            <AppFormField name='manager' autoCapitalize="words" placeholder='Account Manager' />
                            <AppFormField name='movein' placeholder='Move In Date' />
                            <AppFormField name='referee' autoCapitalize="words" placeholder='Referred By' />
                            <TextInput multiline numberOfLines={4} placeholder='Note or Comment' autoCorrect={false} onChangeText={text => setComment(text)} placeholderTextColor={COLORS.lightGray} style={styles.input} />

                            <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                                <AppSubmitButton title='Add Referral' style={{ width: '80%' }} />
                            </View>
                        </AppForm>

                    </KeyboardAvoidingView>
                </ScreenView>
            </ScrollView>

        </Modal>

    )
}

export default AddReferralModal

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: SIZES.statusBarHeight,
        alignItems: 'center'


    },
    input: {
        width: '100%',
        backgroundColor: COLORS.light,
        height: 100,
        marginBottom: 20,
        padding: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,

    }
})
