import React from 'react'

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/contantts';

const Success = ({ route, navigation }) => {
    const { email } = route.params;
    return (
        <View style={styles.view}>
            <Text style={{ ...FONTS.h2, marginBottom: 20 }}>Congratulations!</Text>
            <Text style={{ ...FONTS.body3, marginBottom: 10 }}>Your account has been created but we need to verify your email</Text>
            <Text style={{ ...FONTS.body3, marginTop: 20 }}>Email has been sent to {email}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login', { previewEmail: email })}>
                <Text style={{ ...FONTS.body2 }}>Got it!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Success

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SIZES.padding
    },
    btn: {
        marginTop: SIZES.padding * 1.5,
        shadowOffset: {
            width: 8,
            height: 10
        }, elevation: 10,
        shadowColor: COLORS.secondary,
        shadowOpacity: 0.7,
        shadowRadius: 10,
        backgroundColor: COLORS.light,
        padding: SIZES.padding * 0.5,
        paddingHorizontal: SIZES.padding * 2,
        borderRadius: SIZES.radius * 3

    }
})
