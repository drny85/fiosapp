import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import AnimatedNumbers from 'react-native-animated-numbers';
import ProgressCircle from 'react-native-progress-circle'


const MiniInfoCard = ({ title, subtitle, show = false, tv, onPress, style, percentage, color }) => {

    return (
        <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
            <Text style={{ ...FONTS.h4, color: COLORS.lightText }}>{title}</Text>
            {percentage && (
                <ProgressCircle
                    containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    percent={percentage || 0}
                    radius={SIZES.width / 20}
                    borderWidth={5}
                    color={color ? color : COLORS.green}
                    shadowColor={COLORS.primary}
                    bgColor={COLORS.card}

                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <AnimatedNumbers animationDuration={600} animateToNumber={Math.ceil(percentage) || 0} fontStyle={{ ...FONTS.body5, color: COLORS.lightText }} />
                        <Text style={{ color: COLORS.lightText }}>%</Text>
                    </View>

                </ProgressCircle>

            )}
            {!percentage && !show && (
                <AnimatedNumbers animationDuration={600} animateToNumber={subtitle} fontStyle={{ ...FONTS.h3, color: COLORS.lightText }} />
            )}
            {!percentage && show && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 25 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.body5 }}>Int: </Text>
                        <AnimatedNumbers animationDuration={600} animateToNumber={subtitle} fontStyle={{ ...FONTS.h4, color: COLORS.black }} />
                    </View>
                    <View style={{ paddingHorizontal: 2 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.body5 }}>TV: </Text>
                        <AnimatedNumbers animationDuration={600} animateToNumber={tv} fontStyle={{ ...FONTS.h4 }} />
                    </View>

                </View>
            )}

        </TouchableOpacity>
    )
}

export default MiniInfoCard

const styles = StyleSheet.create({
    view: {
        maxWidth: SIZES.width / 3,
        height: SIZES.width / 5,

        shadowColor: COLORS.card,
        shadowOffset: {
            height: 3, width: 6
        },
        shadowOpacity: 0.7,
        flex: 1,
        shadowRadius: SIZES.radius * 0.5,
        //elevation: 6,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius * 1.1,
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 8,
        marginHorizontal: 5


    }
})
