import React, { useState } from 'react'
import { Modal } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import { COLORS, SIZES } from '../../constants/contantts'

const AddReferralModal = ({ visible, onPress }) => {

    return (

        <Modal animationType='slide' visible={visible}>
            <View style={styles.view}>
                <ButtonsTop iconRightName='close' canGoBack={false} onPress={onPress} />
                <Text>Modal</Text>
            </View>

        </Modal>

    )
}

export default AddReferralModal

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: COLORS.light,
        marginTop: SIZES.statusBarHeight


    }
})
