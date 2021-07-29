import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-native'
import { StyleSheet, Text, View, TextInput, Platform, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'

import * as Yup from 'yup'
import AppSubmitButton from '../../components/AppSubmitButton'
import ScreenView from '../ScreenView'
import referralsContext from '../../context/referrals/referralContext'
import managersContext from '../../context/manager/managersContext'
import authContext from '../../context/auth/authContext'
import PickerModal from './PickerModal'
import { states } from '../../states'
import refereesContext from '../../context/referee/refereesContext'
import { statuses } from '../../statuses';
import { services } from '../../services';
import { TouchableHighlight } from 'react-native';
import Loader from '../../components/Loader';








const referralSchema = Yup.object().shape({
    name: Yup.string().required().label('Full Name'),
    address: Yup.string().required().label('Address'),
    apt: Yup.string().label('Apt, Suite, Unit'),
    city: Yup.string().required().label('City'),
    zipcode: Yup.string().min(5).required().label('Zip Code'),
    mon: Yup.string().max(13).label('MON'),
    phone: Yup.string().min(10).required().label('Phone'),
    email: Yup.string().email().label('Email'),
    property: Yup.string(),

})


const AddReferralModal = ({ visible, setVisible, onPress, edit = false, initialValues = null }) => {

    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPicker, setShowPicker] = useState(false)
    const [showAMs, setShowAms] = useState(false)
    const [showRE, setShowReferee] = useState(false)
    const { user } = useContext(authContext)
    const { addReferral, updateReferral } = useContext(referralsContext)
    const { managers, getManagers } = useContext(managersContext)
    const { referees, getReferees } = useContext(refereesContext)
    const [state, setState] = useState({ id: 'NY', name: 'New York' })
    const [manager, setManager] = useState('')
    const [referee, setReferee] = useState('')
    const [mon, setMon] = useState('')
    const [status, setStatus] = useState({ id: 'new', name: 'New' })
    const [packages, setPackages] = useState(null)
    const [show, setShow] = useState(true);
    const [pickStatus, setPickStatus] = useState(false);

    ///packages
    const [internet, setInternet] = useState(null)
    const [tv, setTv] = useState(null)
    const [home, setHome] = useState(null)
    const [showInternetPicker, setShowInternetPicker] = useState(false)
    const [showTvPicker, setShowTvPicker] = useState(false)
    const [showHomePicker, setShowHomePicker] = useState(false)

    const [moveIn, setMoveIn] = useState(new Date(new Date().getTime()))
    const [dueDate, setDueDate] = useState(new Date())
    const [orderDate, setOrderDate] = useState(new Date())

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setMoveIn(currentDate);
    };
    const onChangeDueDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDueDate(currentDate);
    };
    const onChangeOrderDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setOrderDate(currentDate);
    };

    const referralHandler = async (values) => {
        try {

            if (state === '' || manager === '' || referee === '') {
                alert('Please check all fields')
                return;
            }

            if (status.name.toLowerCase() === 'closed') {
                if (!internet && !tv && !home) {
                    alert('Please select the service that was ordered')
                    return;
                } else if (mon === '' || mon.length < 13) {
                    alert("Please enter a valid order number - 'MON'")
                    return;
                }
            }
            values.date_entered = new Date().toISOString()
            values.due_date = edit ? new Date(dueDate).toISOString() : null;
            values.order_date = edit ? new Date(orderDate).toISOString() : null;
            values.status = status;
            values.package = edit && status.name.toLowerCase() === 'closed' ? { internet, tv, home } : null;
            values.updated = edit ? new Date().toISOString() : null;
            values.mon = edit ? mon : null;
            values.collateral_sent = false;
            values.collateral_sent_on = null;
            values.property = values.property ? values.property : null;
            values.state = state

            values.comment = comment !== '' ? comment : null;
            values.userId = user.id;
            values.referee = referee;
            values.manager = manager;
            values.moveIn = new Date(moveIn).toISOString()

            setLoading(true)
            if (initialValues && edit) {

                const updated = await updateReferral(values)
                if (updated) {
                    setVisible(false)
                    setLoading(false)

                }
            } else if (!edit) {

                const added = await addReferral(values)
                if (added) {
                    setVisible(false)
                    setLoading(false)

                }
            } else {
                setLoading(false)
                return;
            }

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getManagers(user?.userId)
        getReferees(user?.userId)

        if (initialValues) {

            setManager(initialValues.manager)
            setReferee(initialValues.referee)
            setMoveIn(new Date(new Date().getTime()))
            setState(initialValues.state)
            setStatus(initialValues.status)
            setComment(initialValues?.comment)
            setMon(initialValues.mon)
            setDueDate(new Date(new Date().getTime()))
            setOrderDate(new Date(new Date(initialValues.order_date).getTime()))
            setInternet(initialValues.package.internet)
            setTv(initialValues.package.tv)
            setHome(initialValues.package.home)
        }

        return () => {

        }
    }, [user])

    if (loading) return <Loader />

    return (

        <Modal animationType='slide' visible={visible}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ marginHorizontal: 10 }}>
                <ScreenView>
                    <View style={{ width: '100%', marginTop: 20, marginRight: 30, }}>
                        <ButtonsTop iconRightName='close' canGoBack={false} onPress={() => setVisible(false)} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ width: '100%', marginBottom: 50, }}>
                        <AppForm validationSchema={referralSchema} onSubmit={referralHandler} initialValues={initialValues ? initialValues : { name: '', address: '', apt: '', city: '', zipcode: '', phone: '', email: '', property: '' }}>
                            <AppFormField name='name' autoFocus={true} autoCapitalize="words" editing={true} autoCorrect={false} placeholder='Customer Full Name' />
                            <View style={{ flexDirection: 'row' }}>
                                <AppFormField containerStyle={{ width: '65%' }} name='address' autoCapitalize="words" placeholder='Address - 123 Main St' />
                                <AppFormField containerStyle={{ width: '35%' }} name='apt' autoCapitalize="words" autoCorrect={false} placeholder='Apt #, Unit, Suite' />
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                                <AppFormField style={{ width: '100%' }} containerStyle={{ width: '50%' }} name='city' autoCapitalize="words" placeholder='City' />
                                <AppFormField style={{ width: '100%' }} containerStyle={{ width: '50%' }} name='state' onFocus={() => setShowPicker(true)} autoCapitalize="words" value={state.id} placeholder='State - NY, NJ, MA' />
                            </View>

                            <AppFormField name='zipcode' autoCorrect={false} placeholder='Zip Code, Postal Code' />

                            <AppFormField name='phone' placeholder='Phone' />
                            <AppFormField name='email' textContentType="emailAddress" autoCapitalize="none" placeholder='Email Address' />
                            <AppFormField name='manager' autoCapitalize="words" value={manager?.name} onFocus={() => setShowAms(true)} placeholder='Account Manager' />
                            <AppFormField name='status' autoCapitalize="words" value={status?.name} onFocus={() => setPickStatus(true)} placeholder='Status' />
                            {/* <AppFormField name='movein' placeholder='Move In Date' onFocus={() => setShow(true)} /> */}
                            <View style={{ width: '98%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Move In:</Text>
                                    <DateTimePicker
                                        style={{ width: '90%', marginRight: SIZES.padding * 0.5 }}
                                        testID="dateTimePicker"
                                        value={moveIn}
                                        mode='date'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />
                                </View>
                                {initialValues && status.name.toLowerCase() === 'closed' && (


                                    <>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Due Date:</Text>
                                            <DateTimePicker
                                                style={{ width: '90%', marginRight: SIZES.padding * 0.5 }}
                                                testID="dateTimePicker"
                                                value={dueDate}
                                                mode='date'
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeDueDate}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Order Date:</Text>
                                            <DateTimePicker
                                                style={{ width: '90%', marginRight: SIZES.padding * 0.5 }}
                                                testID="dateTimePicker"
                                                value={dueDate}
                                                mode='date'
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeOrderDate}
                                            />
                                        </View>

                                    </>




                                )}


                            </View>
                            {
                                initialValues && status.name.toLowerCase() === 'closed' && (
                                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <AppFormField name='mon' style={{ width: '100%' }} placeholder='MON' maxLength={13} value={mon} onChangeText={text => setMon(text.toUpperCase())} />
                                        <View style={{ width: SIZES.width, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...FONTS.h4 }}>Select Services Ordered:</Text>
                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <TouchableOpacity onPress={() => setShowInternetPicker(true)} style={[styles.pick, { backgroundColor: !showInternetPicker ? COLORS.background : COLORS.lightGray }]}>
                                                    <Text style={{ ...FONTS.h5 }}>{internet ? internet.name : 'Internet'}</Text>
                                                    {internet && (<TouchableHighlight style={styles.pickIcon} onPress={() => setInternet(null)}>
                                                        <Text>x</Text>
                                                    </TouchableHighlight>)}

                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setShowTvPicker(true)} style={[styles.pick, { backgroundColor: showTvPicker ? COLORS.lightGray : COLORS.background }]}>
                                                    <Text style={{ ...FONTS.h5 }}>{tv ? tv.name : 'TV'}</Text>
                                                    {tv && (<TouchableHighlight style={styles.pickIcon} onPress={() => setTv(null)}>
                                                        <Text>x</Text>
                                                    </TouchableHighlight>)}

                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setShowHomePicker(true)} style={[styles.pick, { backgroundColor: showHomePicker ? COLORS.lightGray : COLORS.background }]}>
                                                    <Text style={{ ...FONTS.h5 }}>{home ? home.name : 'Home'}</Text>
                                                    {home && (<TouchableHighlight style={styles.pickIcon} onPress={() => setHome(null)}>
                                                        <Text>x</Text>
                                                    </TouchableHighlight>)}

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                )
                            }
                            <AppFormField name='referee' autoCapitalize="words" onFocus={() => setShowReferee(true)} value={referee.name} placeholder='Referred By' />
                            <TextInput multiline numberOfLines={4} scrollEnabled={true} name='comment' placeholder='Note or Comment' autoCorrect={false} value={comment} onChangeText={text => setComment(text)} placeholderTextColor={COLORS.lightGray} style={styles.input} />

                            <View style={{ width: '100%', alignItems: 'center', marginBottom: 20, }}>
                                <AppSubmitButton title={initialValues ? 'Update Referral' : 'Add Referral'} style={{ width: '80%' }} />
                            </View>
                        </AppForm>

                    </KeyboardAvoidingView>
                    <PickerModal data={states} showPicker={showPicker} title='State' onPress={(st) => {
                        setShowPicker(false)
                        setState(st)
                    }} />
                    <PickerModal data={managers} showPicker={showAMs} title='AM' onPress={(am) => {
                        setShowAms(false)
                        setManager(am)
                    }} />
                    <PickerModal data={referees} showPicker={showRE} title='Referee' onPress={(referee) => {
                        setShowReferee(false)
                        setReferee(referee)
                    }} />
                    <PickerModal data={statuses} showPicker={pickStatus} title='Status' onPress={(newStatus) => {
                        setPickStatus(false)
                        setStatus(newStatus)
                    }} />

                    <PickerModal data={services[0].internet} showPicker={showInternetPicker} title='Internet' onPress={(int_serv) => {
                        setShowInternetPicker(false)
                        setInternet(int_serv)
                    }} />
                    <PickerModal data={services[1].tv} showPicker={showTvPicker} title='TV' onPress={(tv_serv) => {
                        setShowTvPicker(false)
                        setTv(tv_serv)
                    }} />
                    <PickerModal data={services[2].phone} showPicker={showHomePicker} title='Phone / Wiresss' onPress={(home_serv) => {
                        setShowHomePicker(false)
                        setHome(home_serv)
                    }} />


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

    },
    pick: {
        shadowColor: COLORS.lightGray,
        shadowOffset: { width: 4, height: 6 },
        elevation: 8,
        shadowOpacity: 0.7,
        shadowRadius: 8,

        borderRadius: (SIZES.width / 3) / 2,
        width: SIZES.width / 3.2,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5,
        justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 4,
        marginHorizontal: 4
    },
    pickIcon: { height: 20, width: 20, borderRadius: 10, backgroundColor: COLORS.light, justifyContent: 'center', alignItems: 'center' }
})
