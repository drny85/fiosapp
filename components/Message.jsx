import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'
import  Swipeable  from 'react-native-gesture-handler/Swipeable'
import { Entypo } from '@expo/vector-icons';
import { useRef } from 'react';




const Message = ({ sender, message, timeStamp, userId, onReply, onDelete, onClose }) => {
   
    const rightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1,0],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate(({
            inputRange: [-100, -50,0],
            outputRange: [1, 0.5,0],

        }))
       

        return (<Animated.View style={[styles.left,{transform:[{scale}], opacity}]}>
            <TouchableOpacity onPress={onReply} style={{flexDirection:'row', alignItems:'center', justifyContent:'center',}}>
            <Entypo name="reply" size={24} color={COLORS.blue} />
                <Animated.Text>reply</Animated.Text>
            </TouchableOpacity>
            {userId === sender.id && (<TouchableOpacity onPress={userId === sender.id && onDelete}  style={{flexDirection:'row', alignItems:'center'}}>
            <Entypo name="trash" size={24} color={COLORS.red} />
                <Animated.Text style={{color:COLORS.red}}>delete</Animated.Text>
            </TouchableOpacity>)}
            
        </Animated.View>)
    }
    

    return (
    <Swipeable overshootRight={false} onSwipeableClose={onClose} renderRightActions={rightActions}>
    <View style={[styles.message, { alignSelf: sender.id === userId ? 'flex-end' : 'flex-start', backgroundColor: sender.id === userId ? COLORS.green : COLORS.tile }]}>
        <Text style={styles.sender}>{sender.name}</Text>
        <Text style={{ ...FONTS.body3 }}>{message}</Text>
        <Text style={styles.timeStamp}>{timeStamp}</Text>

    </View>
    </Swipeable>)
}


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
        color: COLORS.lightGray,
        top: -25,
        left: 0,
        paddingLeft: 10,
        textTransform: 'capitalize',
        marginVertical: 6,
    },
    timeStamp: {
        ...FONTS.body5,
        position: 'absolute',
        bottom: -25, right: 5,
    },
    left: {
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor: COLORS.lightGray,
       width: '50%',
       flexDirection:'row'
        
    }

})
