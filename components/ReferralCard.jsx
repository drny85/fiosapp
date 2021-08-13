import React from 'react'
import moment from 'moment'

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'

const ReferralCard = ({ referral, onPress, style }) => {


    const line = referral.address.split(',')
    const line1 = line[0] + ` ${referral.apt ? ', ' + referral.apt : ''}`;
    const line2 = line[1].trim() + ', ' + line[2]


    return (
        <TouchableOpacity onPress={onPress} style={[styles.view, { backgroundColor: referral.status.name === 'Closed' ? COLORS.green : COLORS.white }, style]}>
            <Text style={{ ...FONTS.h3, textAlign: 'center', marginBottom: 4 }}>{referral.name}</Text>
            <View style={{ alignItems: 'flex-start' }}>
                <View>
                    <Text style={{ ...FONTS.h4 }}>Address: <Text style={{ ...FONTS.body4 }}>{line1} {line2}</Text></Text>
                    <Text style={{ ...FONTS.h4 }}>Phone: <Text style={{ ...FONTS.body4 }}>{referral.phone}</Text></Text>
                    {(referral.email !== '' || referral.email !== null) && (<Text style={{ ...FONTS.h4 }}>Email: <Text style={{ ...FONTS.body4 }}>{referral.email}</Text></Text>)}

                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ ...FONTS.h4, marginRight: 10, }}>Move In:</Text>

                        <Text style={{ ...FONTS.body4 }}>{moment(referral.moveIn).format('ll')}</Text>
                    </View>

                    <Text style={{ ...FONTS.body4 }}>{moment(referral.moveIn).fromNow()}</Text>


                </View>
                <View style={{ marginTop: 10, }}>
                    <Text style={{ ...FONTS.h3 }}>Status: {referral.status.name}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default ReferralCard

const styles = StyleSheet.create({
    view: {
        width: '95%',
        height: SIZES.height / 5,
        maxHeight: 200,
        minHeight: 100,
        padding: SIZES.padding * 0.6,
        shadowColor: COLORS.card,
        shadowOffset: {
            width: 8,
            height: 8,

        },
        elevation: 10,
        shadowOpacity: 0.6,
        shadowRadius: 10,
        backgroundColor: COLORS.white,
        marginVertical: 5,
        borderRadius: SIZES.radius,
        alignSelf: 'center'


    }
})
