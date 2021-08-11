import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import AnimatedNumbers from 'react-native-animated-numbers';

const MiniInfoCard = ({ title, subtitle, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
            <Text style={{ ...FONTS.body5 }}>{title}</Text>
            <AnimatedNumbers animationDuration={600} animateToNumber={subtitle} fontStyle={{ ...FONTS.h3 }} />
        </TouchableOpacity>
    )
}

export default MiniInfoCard

const styles = StyleSheet.create({
    view: {
        maxWidth: SIZES.width / 3,
        height: SIZES.width / 8,
        padding: SIZES.padding * 0.5,
        shadowColor: COLORS.card,
        shadowOffset: {
            height: 3, width: 6
        },
        shadowOpacity: 0.7,
        flex: 1,
        shadowRadius: SIZES.radius * 0.5,
        //elevation: 6,
        backgroundColor: COLORS.background,
        borderRadius: SIZES.radius * 1.1,
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 8,
        marginHorizontal: 5


    }
})
