import React from 'react'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const DismissKeyboard = ({ children, containerStyle, style }) => {
    return (
        <TouchableWithoutFeedback containerStyle={containerStyle} style={style} onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    )
}

export default DismissKeyboard

