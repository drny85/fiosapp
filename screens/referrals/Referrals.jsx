import React, { useContext, useEffect, useState } from 'react'


import { StyleSheet, FlatList, Alert, View, Text } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import Loader from '../../components/Loader'
import ReferralCard from '../../components/ReferralCard'
import { FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import referralsContext from '../../context/referrals/referralContext'
import AppPersonModal from '../modals/AddPersonModal'
import AddReferralModal from '../modals/AddReferralModal'
import ScreenView from '../ScreenView'

const Referrals = ({ navigation }) => {
    const { referrals, loading } = useContext(referralsContext)
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)
    const { user } = useContext(authContext)


    const goToAddReferralScreen = () => {
        if (!user.coach || !user.manager) {
            Alert.alert('Incomplete', 'Please add a manager and coach', [{ text: 'Go to Profile', onPress: () => navigation.navigate('ProfileStack', { screen: "Profile" }) }, { text: 'Cancel', style: 'cancel' }])
            return;
        }
        navigation.navigate('AddReferralScreen', { edit: false, referral: null })
    }

    const hideAddPersonModal = () => {
        setShow(false)
    }

    const checkIfUserHasCoach = () => {
        if (!user.coach || !user.manager) {
            Alert.alert('Incomplete Profile', 'You must add at least a coach and a manager to add a referral', [{ text: 'Add Coach/Manager', onPress: () => navigation.navigate('ProfileStack', { screen: 'Profile' }) },
            { text: 'Cancel', style: 'destructive' }])
            return
        }
    }

    const items = ({ item }) => {

        return (
            <ReferralCard referral={item} onPress={() => navigation.navigate('ReferralDetails', { id: item.id })} />
        )
    }

    useEffect(() => {
        checkIfUserHasCoach()


        return () => {

        }
    }, [user])


    if (loading) return <Loader />


    return (
        <ScreenView style={styles.view}>
            <ButtonsTop iconRightName='plus' canGoBack={false} onPress={goToAddReferralScreen} />
            {referrals.length > 0 ? (
                <>
                    <FlatList contentContainerStyle={{ width: SIZES.width }} data={referrals} keyExtractor={item => item.id} renderItem={items} />



                    <AddReferralModal visible={visible} setVisible={setVisible} onPress={() => setVisible(false)} />
                </>
            ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.h4 }}>No Referrals</Text>
                    </View>
                )}



        </ScreenView>
    )
}

export default Referrals

const styles = StyleSheet.create({
    view: {
        width: SIZES.width,
        alignItems: 'center',



    }
})
