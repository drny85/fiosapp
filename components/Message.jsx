import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'

const Message = ({ sender, message, timeStamp, userId }) => {

    return <View style={[styles.message, { alignSelf: sender.id === userId ? 'flex-end' : 'flex-start', backgroundColor: sender.id === userId ? COLORS.green : COLORS.tile }]}>
        <Text style={styles.sender}>{sender.name}</Text>
        <Text style={{ ...FONTS.body3 }}>{message}</Text>
        <Text style={styles.timeStamp}>{timeStamp}</Text>

    </View>
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
        paddingVertical: SIZES.padding * 0.7,
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
    }

})
