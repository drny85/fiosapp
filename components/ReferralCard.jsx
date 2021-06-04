import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localized from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localized)


import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'

const ReferralCard = ({ referral, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.view, style]}>
            <Text style={{ ...FONTS.h3 }}>{referral.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text>{referral.address} {referral.apt && referral.apt}</Text>
                    <Text>{referral.city}, {referral.state} {referral.zipcode}</Text>
                    <Text>{referral.phone}</Text>
                </View>
                <View>
                    <Text style={{ ...FONTS.h4 }}>Move In</Text>
                    <Text style={{ ...FONTS.body4 }}>{dayjs(referral.movein).format('ll')}</Text>
                    <Text style={{ ...FONTS.body4 }}>{dayjs(referral.movein).fromNow()}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default ReferralCard

const styles = StyleSheet.create({
    view: {
        width: '95%',
        height: SIZES.height / 8,

        padding: SIZES.padding * 0.6,
        shadowColor: COLORS.lightGray,
        shadowOffset: {
            width: 8,
            height: 10,

        },
        elevation: 10,
        shadowOpacity: 0.6,
        shadowRadius: 10,
        backgroundColor: COLORS.primary,
        marginVertical: 5,
        borderRadius: SIZES.radius,
        alignSelf: 'center'


    }
})
