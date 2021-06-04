import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import AnimatedNumbers from 'react-native-animated-numbers';

const MiniInfoCard = ({ title, subtitle, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
            <Text style={{ ...FONTS.body4 }}>{title}</Text>
            <AnimatedNumbers animateToNumber={subtitle} fontStyle={{ ...FONTS.h2 }} />
        </TouchableOpacity>
    )
}

export default MiniInfoCard

const styles = StyleSheet.create({
    view: {
        maxWidth: SIZES.width / 3,
        height: 80,
        padding: SIZES.padding * 0.6,
        shadowColor: COLORS.light,
        shadowOffset: {
            height: 5, width: 8
        },
        shadowOpacity: 0.7,
        shadowRadius: SIZES.radius * 0.5,
        elevation: 10,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,


    }
})
