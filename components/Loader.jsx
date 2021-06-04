import React from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../constants/contantts'

const Loader = () => {
    return (
        <View style={styles.view}>
            <ActivityIndicator color={COLORS.lightGray} />
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center'
    }
})
