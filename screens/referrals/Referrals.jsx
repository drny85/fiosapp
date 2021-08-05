import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, View, Text, TouchableOpacity, TextInput, Modal } from 'react-native'
import ReferralCard from '../../components/ReferralCard'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import referralsContext from '../../context/referrals/referralContext'
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_KEY } from '@env'


const Referrals = ({ navigation }) => {
    const { referrals } = useContext(referralsContext)
    const { user } = useContext(authContext)
    const [disposition, setDisposition] = useState('new')
    const [searchResult, setSearchResult] = useState('')
    const [showFilter, setShowFilter] = useState(false)
    const [referralCopy, setReferralCopy] = useState([])

    const handleSearch = e => {
        const newSearch = referralCopy.filter(r => {
            const regex = new RegExp(`${searchResult}`, "gi");
            return (
                r.name.match(regex) ||
                r.address.match(regex) ||
                r.mon?.match(regex) ||
                r.phone.match(regex) ||
                r.apt?.match(regex) ||
                r.comment?.match(regex)
            );
        })

        setReferralCopy([...newSearch])
        if (searchResult === '') {
            setReferralCopy([...referrals])
        }
    }


    const goToAddReferralScreen = () => {
        if (!user.coach || !user.manager) {
            Alert.alert('Incomplete', 'Please add a manager and coach', [{ text: 'Go to Profile', onPress: () => navigation.navigate('ProfileStack', { screen: "Profile" }) }, { text: 'Cancel', style: 'cancel' }])
            return;
        }
        navigation.navigate('AddReferralScreen', { edit: false, referral: null })
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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: referrals.length > 0 && <Text style={{ ...FONTS.h3, textTransform: 'capitalize' }}>{disposition}</Text>,
            headerRight: () => <TouchableOpacity style={{ marginRight: 20 }} onPress={goToAddReferralScreen}>
                <AntDesign name='plus' color={COLORS.black} size={24} />
            </TouchableOpacity>,
            headerLeft: () => referrals.length > 0 && <TouchableOpacity onPress={() => setShowFilter(true)} style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <Text style={{ ...FONTS.body3, marginRight: 8, }}>Filter</Text>
                <Ionicons name="ios-filter" size={24} color="black" />
            </TouchableOpacity>
        })
    }, [navigation])

    useEffect(() => {

        checkIfUserHasCoach()

        setReferralCopy([...referrals])
        return () => {
            setSearchResult('')
        }
    }, [user])

    if (referrals.length === 0) {
        return <View style={[styles.view, { alignItems: 'center', justifyContent: 'center', height: '100%' }]}>
            <Text>No Referrals</Text>
        </View>
    }


    return (
        <View style={styles.view}>
            <View style={{ width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center', height: 45, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 2, backgroundColor: COLORS.white, marginBottom: 10, }}>
                <TextInput numberOfLines={1} value={searchResult} onChangeText={text => setSearchResult(text)} onKeyPress={handleSearch}
                    placeholder='Search By Name, MON, Address, Apt, Phone' style={{ width: '100%', paddingHorizontal: 20, ...FONTS.body4 }} enablesReturnKeyAutomatically returnKeyType='search' />
                {searchResult.length > 1 && (<TouchableOpacity onPress={() => {
                    setSearchResult('');
                    setReferralCopy([...referrals])
                }} style={{ position: 'absolute', alignItems: 'center', right: 10, }}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>)}
            </View>

            {
                referrals.length > 0 ? (

                    <FlatList contentContainerStyle={{ width: SIZES.width }} data={searchResult.length > 1 ? referralCopy : referrals} keyExtractor={item => item.id} renderItem={items} />

                ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ ...FONTS.h4 }}>No Referrals</Text>
                        </View>
                    )
            }

            <Modal transparent visible={showFilter} animationType='slide' style={{ height: 300, }}>
                <View style={{ backgroundColor: COLORS.gray, position: 'absolute', left: 0, right: 0, height: '70%', bottom: 0, borderTopEndRadius: 35, borderTopLeftRadius: 35, }}>
                    <TouchableOpacity style={{ position: 'absolute', top: 20, left: 30 }} onPress={() => setShowFilter(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginTop: 50, padding: SIZES.padding }}>

                        <Text>Apply </Text>
                    </View>

                </View>
            </Modal>

        </View >
    )
}

export default Referrals

const styles = StyleSheet.create({
    view: {
        width: SIZES.width,
        marginTop: 10,
        alignItems: 'center',



    }
})
