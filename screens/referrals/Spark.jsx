import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'

import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { useNavigation } from '@react-navigation/native';

const Spark = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={{ flex: 1, height: SIZES.height }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 40, backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: SIZES.radius * 3, position: 'absolute', zIndex: 100, alignItems: "center", justifyContent: 'center', top: SIZES.statusBarHeight + 10, width: 80 }}>

                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>EXIT</Text>
            </TouchableOpacity>
            <WebView originWhitelist={['*']} style={{ flex: 1, backgroundColor: COLORS.white }} containerStyle={{ flex: 1, backgroundColor: 'red' }} source={{ uri: 'https://fiosnynw2-spark.thismomentone.com/login' }} />
        </SafeAreaView>



    )
}

export default Spark
