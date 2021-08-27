import React, { forwardRef } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

import { COLORS, FONTS, SIZES } from '../constants/contantts'

const InputTextField = forwardRef(({ style, placeholder, placeholderTextColor, value, onChangeText, autoFocus, autoCapitalize, ...others }, ref) => {

    return (

        <View>
            <TextInput ref={ref} textAlignVertical='center' autoFocus={autoFocus} autoCapitalize={autoCapitalize} {...others} placeholder={placeholder} value={value} onChangeText={onChangeText} placeholderTextColor={placeholderTextColor || COLORS.placeHolderTextColor} style={[styles.input, style]} />
        </View>

    )
})

export default InputTextField

const styles = StyleSheet.create({
    input: {
        borderBottomColor: COLORS.light,
        borderBottomWidth: 0.6,
        paddingVertical: SIZES.padding * 0.3,
        paddingHorizontal: SIZES.padding * 0.5,
        marginVertical: SIZES.padding * 0.5,

        ...FONTS.body3
    }
})
