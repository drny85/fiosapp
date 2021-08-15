import React from 'react'
import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { COLORS, SIZES } from '../constants/contantts';

const ScreenView = ({ children, style }) => {
    return (
        <View style={[styles.view, style]}>
            <View style={{ marginTop: SIZES.statusBarHeight }}>
                {children}
            </View>
            <StatusBar style='auto' />
        </View>
    )
}

export default ScreenView

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: COLORS.background
    }
})
