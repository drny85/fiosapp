import React, { useContext, useEffect, useState } from 'react'


import { StyleSheet, FlatList, Alert } from 'react-native'
import ButtonsTop from '../../components/ButtonsTop'
import Loader from '../../components/Loader'
import ReferralCard from '../../components/ReferralCard'
import { SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import referralsContext from '../../context/referrals/referralContext'
import AppPersonModal from '../modals/AddPersonModal'
import AddReferralModal from '../modals/AddReferralModal'
import ScreenView from '../ScreenView'

const Referrals = ({ navigation }) => {
    const { referrals, getReferrals, loading } = useContext(referralsContext)
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)
    const { user } = useContext(authContext)


    const goToAddReferralScreen = () => {
        if (!user.coach || !user.manager) {
            alert('Please add manager or coach to continue')
            return;
        }
        setVisible(true)
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
            <ReferralCard referral={item} onPress={() => console.log(item.id)} />
        )
    }

    useEffect(() => {
        checkIfUserHasCoach()
        const sub = referrals.length === 0 && (async () => await getReferrals(user.id))

        return () => {
            sub && sub()
        }
    }, [user])

    console.log('Referral @referrals', referrals)

    if (loading) return <Loader />
    return (
        <ScreenView style={styles.view}>
            <ButtonsTop iconRightName='plus' canGoBack={false} onPress={goToAddReferralScreen} />

            <FlatList contentContainerStyle={{ width: SIZES.width }} data={referrals} keyExtractor={item => item.id} renderItem={items} />



            <AddReferralModal visible={visible} setVisible={setVisible} onPress={() => setVisible(false)} />

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
