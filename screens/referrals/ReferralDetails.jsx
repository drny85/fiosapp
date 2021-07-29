import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../../components/Loader';
import referralsContext from '../../context/referrals/referralContext';
import { COLORS, FONTS, SIZES } from '../../constants/contantts';
import moment from 'moment/moment'

import PhoneCall from '../../components/PhoneCall';
import AddReferralModal from '../modals/AddReferralModal';
import { useState } from 'react';


const ReferralDetails = ({ route, navigation }) => {
    const [visible, setVisible] = useState(false)
    const { referrals } = useContext(referralsContext)

    const referral = referrals.find(r => r.id === route.params.id)

    const inititalValues = {
        name: referral.name,
        address: referral.address,
        apt: referral.apt,
        city: referral.city,
        state: referral.state,
        zipcode: referral.zipcode,
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity style={{ marginRight: SIZES.padding * 0.8 }} onPress={() => navigation.navigate('AddReferralScreen', { edit: true, referral: inititalValues })} >
                <MaterialCommunityIcons name="square-edit-outline" size={24} color="black" />
            </TouchableOpacity>)
        })
    }, [navigation])

    if (!referral) return <Loader />

    return (
        <ScrollView style={styles.view}>
            <View style={styles.customer}>
                <Text style={[styles.name, { marginBottom: 15, }]}>{referral.name} </Text>
                <Text style={styles.text}>{referral.address} {referral.apt && referral.apt} </Text>
                <Text style={styles.text}>{referral.city}, {referral.state.id} {referral.zipcode} </Text>
                <PhoneCall phone={referral.phone} />
                <Text style={styles.text}>{referral.email && referral.email}</Text>
            </View>
            <View style={styles.customer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.08)', padding: 4 }}>
                    <Text style={styles.text}>
                        Move In: {moment(referral.moveIn).format('ll')}

                    </Text>
                    <Text style={{ color: COLORS.lightGray }}>{moment(referral.moveIn).fromNow()}</Text>
                </View>
                <Text style={styles.text}>Status: {referral.status?.name}</Text>
                <Text style={styles.text}>Referred By: {referral.referee.name}</Text>
                {referral.manager && (<Text style={styles.text}>AM: {referral.manager.name}</Text>)}

            </View>
            {referral?.status.name.toLowerCase() === 'closed' && (
                <View style={styles.customer}>
                    <Text style={styles.text}>Mon: {referral.mon}</Text>
                    <Text style={styles.text}>Due Date: {moment(referral.due_date).format('ll')}</Text>
                    <Text style={styles.text}>Package: {referral.package && referral.package.internet && referral.package.internet.name + ', '}  {referral.package && referral.package.tv && referral.package.tv.name + ', '}  {referral.package && referral.package.home && referral.package.home.name}</Text>
                    <Text style={styles.text}>Order Date: {moment(referral.order_date).format('ll')}</Text>

                </View>
            )}
            <View style={styles.customer}>
                <Text style={{ ...FONTS.h4 }}>Notes or Comments</Text>
                <View style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 8, minHeight: SIZES.height * 0.08 }}>
                    <Text adjustsFontSizeToFit={true} style={{ ...FONTS.body5 }}>
                        {referral.comment ? referral.comment : 'No notes'}
                    </Text>
                </View>

            </View>
            {visible && (<AddReferralModal visible={visible} initialValues={inititalValues} setVisible={setVisible} edit={true} />)}


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
        fontFamily: 'lobster',
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 30,
        textAlign: 'center'

    },
    text: {
        ...FONTS.body3,
        paddingVertical: 2
    }
})
