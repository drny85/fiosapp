import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import AddReferralModal from '../modals/AddReferralModal'
import ScreenView from '../ScreenView'

const Referrals = () => {
    const [visible, setVisible] = useState(false)
    const goToAddReferralScreen = () => {
        setVisible(true)
    }
    return (
        <ScreenView>
            <ButtonsTop iconRightName='plus' canGoBack={false} onPress={goToAddReferralScreen} />
            <Text>Referrals</Text>
            <AddReferralModal visible={visible} onPress={() => setVisible(false)} />
        </ScreenView>
    )
}

export default Referrals

const styles = StyleSheet.create({})
