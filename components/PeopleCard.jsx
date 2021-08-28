import React, { forwardRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Entypo } from '@expo/vector-icons'
import { COLORS, FONTS, SIZES } from '../constants/contantts'

const PeopleCard = forwardRef(({ item, onPress, onEditPress, onDeletePress, onSwipeableWillOpen }, ref) => {

    const rightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate(({
            inputRange: [-100, -50, 0],
            outputRange: [1, 0.5, 0],

        }))


        return (<Animated.View style={[styles.left, { transform: [{ scale }], opacity, alignSelf: 'center', paddingVertical: SIZES.padding }]}>
            <TouchableOpacity onPress={onEditPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <Entypo name='edit' size={24} color={COLORS.blue} />
                <Animated.Text style={{ ...FONTS.body3 }}>Edit</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeletePress} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                <Entypo name="trash" size={24} color={COLORS.red} />
                <Animated.Text style={{ color: COLORS.red, ...FONTS.body3 }}>Delete</Animated.Text>
            </TouchableOpacity>

        </Animated.View>)
    }

    return (
        <Swipeable ref={ref} onSwipeableWillOpen={onSwipeableWillOpen} overshootLeft={false} renderRightActions={rightActions}>
            <TouchableOpacity
                style={styles.item}
                key={item.id}
                onPress={() => onPress(item)}
            >
                <View style={styles.icon}>
                    <Text style={{ ...FONTS.h3 }}> {(item.name.split(' ')[0][0])}{(item.name.split(' ')[1][0])}</Text>
                </View>
                <View>
                    <Text style={{ ...FONTS.body3 }}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    )
})

export default PeopleCard

const styles = StyleSheet.create({

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        elevation: 10,
        shadowColor: COLORS.lightGray,
        shadowOffset: {
            width: 6,
            height: 8,
        },
        shadowOpacity: 0.7,
        shadowRadius: 8,
        backgroundColor: COLORS.background,
        paddingVertical: SIZES.padding * 0.2,
        paddingHorizontal: SIZES.padding,
        marginVertical: 5,
    },
    icon: {
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 60,
        width: 60,
        padding: SIZES.padding * 0.6,
        marginRight: 20,
    },

    left: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center'

    }
})
