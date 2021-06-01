import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../constants/contantts';

const ButtonsTop = ({ onPress, textRight, iconRightName, canGoBack = true, hasRigthAction = true }) => {

    const navigation = useNavigation()
    return (
        <View style={styles.topView}>
            {canGoBack ? (<TouchableOpacity onPress={() => navigation.goBack}>
                <AntDesign name="left" size={30} color="black" />
            </TouchableOpacity>) : <Text></Text>}
            {hasRigthAction ? (<TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {textRight && (<Text>{textRight}</Text>)}
                <AntDesign style={{ marginLeft: 10 }} name={iconRightName} size={30} color="black" />
            </TouchableOpacity>) : <Text></Text>}

        </View>
    )
}

export default ButtonsTop

const styles = StyleSheet.create({
    topView: {
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: SIZES.padding,
        marginBottom: 10,


    }
})
