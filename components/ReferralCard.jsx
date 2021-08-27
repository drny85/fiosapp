import React from 'react'
import moment from 'moment'

import { StyleSheet, Text, View, TouchableOpacity, Animated, } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import { Swipeable } from 'react-native-gesture-handler'
import { Entypo } from '@expo/vector-icons';

const ReferralCard = ({ referral, onPress, style, onDelete }) => {

    
    const line = referral.address.split(',')
    const line1 = line[0] + ` ${referral.apt ? ', ' + referral.apt : ''}`;
    const line2 = line[1].trim() + ', ' + line[2]

    const rightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-125, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate(({
            inputRange: [-100, -50, 0],
            outputRange: [1, 0.5, 0],

        }))


        return (<Animated.View style={[styles.left, { transform: [{ scale }], opacity, alignSelf: 'center', }]}>
            <TouchableOpacity onPress={onDelete} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10, }}>
                <Entypo name="trash" size={30} color={COLORS.white} />
                <Animated.Text style={{ color: COLORS.white, ...FONTS.h3, paddingLeft: 10, opacity }}>Delete</Animated.Text>
            </TouchableOpacity>

        </Animated.View>)
    }


    return (
        <Swipeable overshootRight={false} renderRightActions={rightActions} >
            <TouchableOpacity onPress={onPress} style={[styles.view, { backgroundColor: referral.status.name === 'Closed' ? COLORS.green : referral.status.id === 'in_progress' ? COLORS.progress : referral.status.id === 'not_sold' ? COLORS.red : COLORS.card }, style]}>
                <Text style={{ ...FONTS.h3, textAlign: 'center', marginBottom: 4 }}>{referral.name}</Text>
                <View style={{ alignItems: 'flex-start' }}>
                    <View>
                        <Text style={{ ...FONTS.h4 }}>Address: <Text style={{ ...FONTS.body4 }}>{line1} {line2}</Text></Text>
                        <Text style={{ ...FONTS.h4 }}>Phone: <Text style={{ ...FONTS.body4 }}>{referral.phone}</Text></Text>
                        {(referral.email !== '' || referral.email !== null) && (<Text style={{ ...FONTS.h4 }}>Email: <Text style={{ ...FONTS.body4 }}>{referral.email ? referral.email : 'none'}</Text></Text>)}

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
        </Swipeable>
    )
}

export default ReferralCard

const styles = StyleSheet.create({
    view: {
        width: '95%',
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
        backgroundColor: COLORS.card,
        paddingVertical: SIZES.padding,
        marginVertical: 10,
        borderRadius: SIZES.radius,
        alignSelf: 'center'


    },
    left: {
        width: '30%',
        height: '100%',
        backgroundColor: COLORS.red,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        paddingVertical: SIZES.padding,
    }
})
