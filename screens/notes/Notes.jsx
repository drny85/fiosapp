import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, SIZES } from '../../constants/contantts'
import ScreenView from '../ScreenView'

const Notes = () => {
    return (
        <ScreenView>
            <ButtonsTop canGoBack={false} iconRightName='plus' onPress={() => console.log('Work on adding note')} />

            <View style={styles.view}>
                <Text>More</Text>
            </View>

        </ScreenView>
    )
}

export default Notes

const styles = StyleSheet.create({
    view: {
        height: SIZES.height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray

    }
})
