import ReferenceSet from "yup/lib/util/ReferenceSet";
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from "../../constants/contantts";
import { useNavigation } from "@react-navigation/native";


const HomeNotes = () => {
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, marginTop: SIZES.statusBarHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
            <TouchableOpacity onPress={() => navigation.navigate('Notes')} style={styles.card}>
                <Text style={{ ...FONTS.h2 }}>Go to Notes</Text>
            </TouchableOpacity>
            <View style={{ height: 50 }} />
            <TouchableOpacity onPress={() => navigation.navigate('Todos')} style={styles.card}>
                <Text style={{ ...FONTS.h2 }}>Go to ToDos</Text>
            </TouchableOpacity>

        </View>
    )
}

export default HomeNotes

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        shadowColor: COLORS.card,
        shadowOffset: { width: 4, height: 6 },
        elevation: 8,
        shadowOpacity: 0.7,
        shadowRadius: 8,
        height: SIZES.width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZES.width * 0.9,
        borderRadius: SIZES.radius,


    }
})
