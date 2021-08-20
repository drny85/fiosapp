import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import AnimatedNumbers from 'react-native-animated-numbers';
import ProgressCircle from 'react-native-progress-circle'

const MiniInfoCard = ({ title, subtitle, onPress, style, percentage, color }) => {
    console.log('P', percentage)
    return (
        <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
            <Text style={{ ...FONTS.body5 }}>{title}</Text>
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
                        <AnimatedNumbers animationDuration={600} animateToNumber={Math.ceil(percentage) || 0} fontStyle={{ ...FONTS.h4 }} />
                        <Text>%</Text>
                    </View>

                </ProgressCircle>
            )}
            {!percentage && (
                <AnimatedNumbers animationDuration={600} animateToNumber={subtitle} fontStyle={{ ...FONTS.h3 }} />
            )}

        </TouchableOpacity>
    )
}

export default MiniInfoCard

const styles = StyleSheet.create({
    view: {
        maxWidth: SIZES.width / 3,
        height: SIZES.width / 6,

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
