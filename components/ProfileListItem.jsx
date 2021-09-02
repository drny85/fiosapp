import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { COLORS, FONTS, SIZES } from '../constants/contantts'


const ProfileListItem = ({ tittle, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.view}>
            <Text style={{ ...FONTS.h4, color: COLORS.lightText }}>{tittle}</Text>
            <Entypo name="chevron-right" size={28} color={COLORS.lightText} />
        </TouchableOpacity>
    )
}

export default ProfileListItem

const styles = StyleSheet.create({
    view: {
        backgroundColor: COLORS.card,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        paddingHorizontal: SIZES.padding,
        flexDirection: 'row',
        paddingVertical: SIZES.padding,
        shadowRadius: 10,
        shadowOpacity: 0.7,
        shadowColor: COLORS.light,
        shadowOffset: {
            width: 8, height: 8,
        },
        marginVertical: 5,
        width: SIZES.width * 0.98,
        alignSelf: 'center'
    }
})
