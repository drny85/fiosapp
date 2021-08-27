import React, { useContext, useState, useLayoutEffect, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Modal, Keyboard,Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../../components/Loader';
import referralsContext from '../../context/referrals/referralContext';
import { COLORS, FONTS, SIZES } from '../../constants/contantts';
import moment from 'moment/moment'
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'

import PhoneCall from '../../components/PhoneCall';
import InputTextField from '../../components/InputTextField';
import authContext from '../../context/auth/authContext';
import { scheduleMotification } from '../../hooks/scheduleNotification';


const ReferralDetails = ({ route, navigation }) => {
    
    const [showCommentModal, setShowCommentModal] = useState(false)
    const { updateReferral } = useContext(referralsContext)
    const { user } = useContext(authContext)
    const [updatedComment, setUpdateComment] = useState('')
    const { referrals } = useContext(referralsContext)
    const [show,setShow] = useState(false)
    const [scheduleDate,setScheduleDate] = useState(new Date())

    const referral = referrals.find(r => r.id === route.params.id)
    console.log(scheduleDate)
    const inititalValues = {
        name: referral.name,
        address: referral.address,
        apt: referral.apt,
        referee: referral.referee,
        manager: referral.manager,
        moveIn: referral.moveIn,
        email: referral.email,
        phone: referral.phone,
        comment: referral.comment,
        status: referral.status,
        mon: referral.mon,
        due_date: referral.due_date,
        order_date: referral.order_date,
        id: referral.id,
        package: referral.package,
    }

    const line = referral.address.split(',')
    const line1 = line[0] + ` ${referral.apt ? ', ' + referral.apt : ''}`;
    const line2 = line[1].trim() + ', ' + line[2]
    const line3 = line[2]

    const onKeyBoardShow = e => {

        setKeyH(e.endCoordinates.height)
    }

    const onKeyHide = () => {
        setKeyH(0)
    }

    const scheduleReminder = () => {
        scheduleMotification('Reminder', 'call this person', {...referral}, scheduleDate)
    }


    const handleUpdate = async () => {
        try {

            if (inititalValues.comment !== updatedComment) {
                inititalValues.comment = updatedComment
                inititalValues.userId = user.id;
                const res = await updateReferral(inititalValues)
                if (res) {
                    setShowCommentModal(false)
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        //setShow(Platform.OS === 'ios');

        setShow(Platform.OS === 'ios')
        if (currentDate) {
            setScheduleDate(currentDate);
        }

    };

    



    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity style={{ marginRight: SIZES.padding * 0.8 }} onPress={() => navigation.navigate('AddReferralScreen', { edit: true, referral: inititalValues })} >
                <MaterialCommunityIcons name="square-edit-outline" size={24} color="black" />
            </TouchableOpacity>),
            // headerLeft: 
        })
    }, [navigation])

    useEffect(() => {
        
        setUpdateComment(inititalValues.comment)
        Keyboard.addListener('keyboardDidShow', onKeyBoardShow)
        Keyboard.addListener('keyboardDidHide', onKeyHide)
        return () => {
            Keyboard.removeAllListeners('keyboardDidShow')
            Keyboard.removeAllListeners('keyboardDidHide')
        }
    }, [])


    if (!referral) return <Loader />



    return (
        <ScrollView style={[styles.view, { backgroundColor: referral.status.id === 'closed' ? COLORS.green : referral.status.id === 'not_sold' ? COLORS.red : COLORS.white }]}>
            <Animated.View style={[{position:'absolute', height:100, width:'90%',top:10, alignSelf:'center', zIndex:100, backgroundColor:COLORS.lightGray}]}>
                <Text>Hola Amigo</Text>
                <View>
                <DateTimePicker
                                            timeZoneOffsetInSeconds={0}
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                            testID="dateTimePicker"
                                            value={scheduleDate}
                                            minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                            mode='datetime'
                                            is24Hour={true}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={onDateChange}
                                        />

                        <TouchableOpacity onPress={scheduleReminder}>
                            <Text>Set Reminder</Text>
                        </TouchableOpacity>
                </View>
                
                
            </Animated.View>
            <View style={styles.customer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.name, { ...FONTS.h2 }]}>{referral.name} </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Spark')}>
                        <Ionicons name='mail-outline' size={26} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subText}>{line1} </Text>
                <Text style={styles.subText}>{line2} </Text>

                <PhoneCall phone={referral.phone} />
                <Text style={styles.subText}>{referral.email && referral.email}</Text>
            </View>
            <View style={styles.customer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.08)', padding: 4 }}>
                    <Text style={styles.text}>
                        Move In: <Text style={{ ...FONTS.body4 }}>{moment(referral.moveIn).format('ll')}</Text>

                    </Text>
                    <Text style={{ color: COLORS.lightGray }}>{moment(referral.moveIn).fromNow()}</Text>
                </View>
                <Text style={styles.text}>Status: <Text style={styles.subText}>{referral.status?.name}</Text></Text>
                {referral.referee && (<Text style={styles.text}>Referred By: <Text style={styles.subText}>{referral?.referee.name}</Text> </Text>)}
                {referral.manager && (<Text style={styles.text}>AM: <Text style={styles.subText}>{referral.manager.name}</Text> </Text>)}

            </View>
            {referral?.status.name.toLowerCase() === 'closed' && (
                <View style={styles.customer}>
                    <Text style={[styles.text]}>Mon: <Text style={styles.subText, { ...FONTS.h3 }}>{referral.mon}</Text></Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.Text, { ...FONTS.h4 }]}>Due Date: <Text style={styles.subText}>{moment(referral.due_date).format('ll')}</Text> </Text>
                        <Text style={{ color: COLORS.lightGray }}>{moment(referral.due_date).fromNow()}</Text>
                    </View>

                    <Text style={styles.text}>Package: {referral.package && referral.package.internet && referral.package.internet.name + ', '}  {referral.package && referral.package.tv && referral.package.tv.name + ', '}  {referral.package && referral.package.home && referral.package.home.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.text, { ...FONTS.h4 }]}>Order Date: {moment(referral.order_date).format('ll')}</Text>
                        <Text style={{ color: COLORS.lightGray }}>{moment(referral.order_date).fromNow()}</Text>
                    </View>


                </View>
            )}
            <View style={styles.customer}>
                {referral.updated && (<Text style={{ ...FONTS.h4, marginBottom: 8 }}>Last Update: <Text style={styles.subText}>{moment(referral.updated).format('lll')}</Text></Text>)}
                <Text style={styles.text}>Notes or Comments</Text>
                <TouchableWithoutFeedback onLongPress={() => setShowCommentModal(true)}>
                    <View style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 8, minHeight: SIZES.height * 0.08 }}>
                        <Text adjustsFontSizeToFit={true} style={{ ...FONTS.body5 }}>
                            {referral.comment ? referral.comment : 'No notes'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
            <Modal visible={showCommentModal} transparent>
                <View style={{ height: SIZES.height / 3, position: 'absolute', left: 0, right: 0, top: SIZES.statusBarHeight + 20, backgroundColor: COLORS.card, borderRadius: SIZES.radius, marginHorizontal: SIZES.padding * 0.5 }}>

                    <InputTextField multiline={true} placeholder='Comments or Notes' value={updatedComment} onChangeText={text => setUpdateComment(text)} style={{ height: '75%', backgroundColor: COLORS.white, marginHorizontal: 10, }} />
                    <View style={{ alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 30, flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => setShowCommentModal(false)} style={styles.btn}>
                            <Text style={{ ...FONTS.h4 }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdate} style={styles.btn}>
                            <Text style={{ ...FONTS.h4 }}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



        </ScrollView>
    )
}

export default ReferralDetails

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    customer: {
        padding: SIZES.padding * 0.5,
        backgroundColor: COLORS.background,
        shadowColor: COLORS.lightGray,
        shadowOffset: {
            width: 6, height: 8
        }, elevation: 10,
        shadowOpacity: 0.6,
        shadowRadius: 8,
        width: '98%',
        alignSelf: 'center',
        marginVertical: 8,



    },
    name: {

        textAlign: 'center'

    },
    text: {
        ...FONTS.h4,
        paddingVertical: 2
    },
    subText: {
        ...FONTS.body4
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white

    }
})
