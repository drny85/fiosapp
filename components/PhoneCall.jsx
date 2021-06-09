import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Communications from 'react-native-communications';
import { FONTS } from '../constants/contantts';


const PhoneCall = ({ phone, style, textStyle }) => {

    const makeCall = async () => {
        try {
            Communications.phonecall(phone.replace(/-/g, ""), true);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <TouchableOpacity style={{ ...style }} onPress={makeCall}>
            <Text style={{ ...FONTS.body3, ...textStyle, color: '#5792E3' }}>{phone}</Text>
        </TouchableOpacity>
    )
}

export default PhoneCall


