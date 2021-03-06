import React, { forwardRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Entypo } from '@expo/vector-icons';
import moment from 'moment'



const Message = forwardRef(({ userId, onReply, onDelete, onClose, msgBody, onSwipeableWillOpen }, ref) => {

    const { isReplied, reply, body, sender, timestamp } = msgBody

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
            <TouchableOpacity onPress={onReply} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <Entypo name="reply" size={24} color={COLORS.blue} />
                <Animated.Text style={{ ...FONTS.body3 }}>reply</Animated.Text>
            </TouchableOpacity>
            {userId === sender.id && (<TouchableOpacity onPress={userId === sender.id && onDelete} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name="trash" size={24} color={COLORS.red} />
                <Animated.Text style={{ color: COLORS.red, ...FONTS.h3 }}>delete</Animated.Text>
            </TouchableOpacity>)}

        </Animated.View>)
    }


    return (
        <Swipeable ref={ref} overshootRight={false} onSwipeableClose={onClose} onSwipeableWillOpen={onSwipeableWillOpen} renderRightActions={rightActions}>
            <View style={[styles.message, { alignSelf: sender.id === userId ? 'flex-end' : 'flex-start', backgroundColor: sender.id === userId ? COLORS.card : COLORS.tile }]}>
                {isReplied && (<Text style={{ ...FONTS.h5, color: COLORS.white, opacity: 0.6 }}>{reply.sender.name}</Text>)}
                <Text style={styles.sender}>{sender.id === userId ? 'Me' : sender.name}</Text>
                <Text style={{ ...FONTS.body3, color: sender.id === userId ? COLORS.lightText : COLORS.text }}>{isReplied ? reply.body : body}</Text>
                <Text style={styles.timeStamp}>{moment(timestamp?.toDate()).fromNow()}</Text>
                {isReplied && (
                    <View style={{ backgroundColor: COLORS.background, padding: 10, borderRadius: SIZES.radius, marginVertical: 8, }}>
                        <Text style={{ ...FONTS.h4 }}>{body}</Text>
                    </View>
                )}
            </View>

        </Swipeable>)
})




export default Message

const styles = StyleSheet.create({
    message: {
        shadowColor: COLORS.light,
        shadowOffset: { width: 3, height: 5 },
        elevation: 6,
        shadowOpacity: 0.6,
        width: SIZES.width * 0.75,
        shadowRadius: 6,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5,
        marginVertical: SIZES.padding,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius * 2,

    },
    sender: {
        ...FONTS.h5,
        position: 'absolute',
        color: COLORS.black,
        top: -35,
        left: 0,
        paddingLeft: 10,
        opacity: 0.7,
        textTransform: 'capitalize',
        paddingVertical: 4,
        marginVertical: 6,
    },
    timeStamp: {
        ...FONTS.body5,
        position: 'absolute',
        bottom: -25, right: 5,
    },
    left: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        width: '50%',
        flexDirection: 'row'

    }

})
