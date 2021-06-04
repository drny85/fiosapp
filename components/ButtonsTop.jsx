import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/contantts';

const ButtonsTop = ({ onPress, text, textRight, iconRightName, canGoBack = true, hasRigthAction = true }) => {

    const navigation = useNavigation()
    return (
        <View style={[styles.topView, { justifyContent: text ? 'space-evenly' : 'space-between' }]}>
            {canGoBack ? (<TouchableOpacity onPress={() => navigation.goBack}>
                <AntDesign name="left" size={30} color="black" />
            </TouchableOpacity>) : <Text></Text>}
            {text && (<Text>{text}</Text>)}
            {hasRigthAction ? (<TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {textRight && (<Text style={{ ...FONTS.h3 }}>{textRight}</Text>)}
                <AntDesign style={{ marginLeft: 10 }} name={iconRightName} size={30} color="black" />
            </TouchableOpacity>) : <Text></Text>}

        </View>
    )
}

export default ButtonsTop

const styles = StyleSheet.create({
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        marginBottom: 10,
        width: SIZES.width * 0.9,



    },

})
