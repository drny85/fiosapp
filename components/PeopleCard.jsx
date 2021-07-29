import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/contantts'

const PeopleCard = ({ item, onPress }) => {
    return (
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
    )
}

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
})
