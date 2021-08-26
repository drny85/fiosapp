import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, View, Text, TouchableOpacity, TextInput, Modal } from 'react-native'
import ReferralCard from '../../components/ReferralCard'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import authContext from '../../context/auth/authContext'
import referralsContext from '../../context/referrals/referralContext'
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Switch } from 'react-native-elements'
import { db } from '../../database'

const defaltFilter = {
    new: false,
    in_progress: false,
    pending: false,
    not_sold: false,
    closed: false
}

const FilterSwitcher = ({ title, value, onValueChange }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: SIZES.width / 2, marginVertical: 10 }}>
            <Text style={{ ...FONTS.h3, marginRight: 10 }}>{title}</Text>
            <Switch value={value} onValueChange={onValueChange} thumbColor={COLORS.white} trackColor={COLORS.black} />
        </View>
    )
}


const Referrals = ({ navigation }) => {
    const { referrals } = useContext(referralsContext)
    const { user } = useContext(authContext)

    const [searchResult, setSearchResult] = useState('')
    const [title, setTitle] = useState('New')
    const [filterParam, setFilterParam] = useState('new')
    const [showFilter, setShowFilter] = useState(false)
    const [filtered, setFiltered] = useState(false)
    const [referralCopy, setReferralCopy] = useState([])
    const [filter, setFilter] = useState({
        new: true,
        in_progress: false,
        pending: false,
        not_sold: false,
        closed: false
    })
    const [disposition, setDisposition] = useState('New')

    const handleFilter = () => {

        setTitle(disposition)
        const c = [...referralCopy]
        const nc = c.filter(r => r.status.name === disposition)

        setReferralCopy([...nc])
        setFiltered(true)
        setShowFilter(false)
    }

    const handleDelete = async (itemId) => {
        try {
            await db.collection('referrals').doc(user.id).collection('referrals').doc(itemId).delete()
            setReferralCopy(referralCopy.filter(r => r.id !== itemId))
        } catch (error) {
            console.log(error.message)
        }
    }

    const confirmDelete = (id) => {
        Alert.alert('Delete Referral', 'Are you sure you want to delete it?', [{ text: 'NO', style: 'cancel', }, { text: 'YES', style: 'destructive', onPress: () => handleDelete(id) }])
    }

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
            <ReferralCard onDelete={() => confirmDelete(item.id)} referral={item} onPress={() => navigation.navigate('ReferralDetails', { id: item.id })} />
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: referrals.length > 0 && <Text style={{ ...FONTS.h3, textTransform: 'capitalize' }}>{title}</Text>,
            headerRight: () => <TouchableOpacity style={{ marginRight: 20 }} onPress={goToAddReferralScreen}>
                <AntDesign name='plus' color={COLORS.black} size={28} />
            </TouchableOpacity>

        })
    }, [navigation, title])

    useEffect(() => {

        setFilter({ ...defaltFilter, new: true })

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
            <View style={{ width: '100%', flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-around', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    if (filtered) {
                        setFiltered(false)
                        setTitle('New')
                        setFilter({ ...defaltFilter, new: true })
                        setReferralCopy([...referrals])
                    } else {
                        setShowFilter(true)
                    }
                }} style={{ alignItems: 'center', justifyContent: 'center' }}>

                    {filtered ? <MaterialCommunityIcons name="filter-variant-remove" size={28} color="black" /> : <Ionicons name="ios-filter" size={28} color="black" />}
                </TouchableOpacity>

                <View style={{ width: '85%', borderRadius: 30, justifyContent: 'center', alignItems: 'center', height: 45, shadowOffset: { width: -1, height: 3 }, shadowOpacity: 0.4, shadowRadius: 2, backgroundColor: COLORS.white, marginBottom: 10, }}>

                    <TextInput numberOfLines={1} value={searchResult} onChangeText={text => setSearchResult(text)} onKeyPress={handleSearch}
                        placeholder='Search By Name, MON, Address, Etc.' style={{ width: '100%', paddingHorizontal: 20, ...FONTS.body4 }} enablesReturnKeyAutomatically returnKeyType='search' />
                    {searchResult.length > 1 && (<TouchableOpacity onPress={() => {
                        setSearchResult('');
                        setReferralCopy([...referrals])
                    }} style={{ position: 'absolute', alignItems: 'center', right: 10, }}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>)}
                </View>
            </View>

            {
                referrals.length > 0 ? (

                    <FlatList contentContainerStyle={{ width: SIZES.width }} style={{ marginBottom: 50 }} data={(searchResult.length > 1 || filtered) ? referralCopy : referrals.filter(r => r.status.name === 'New')} keyExtractor={item => item.id} renderItem={items} />

                ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ ...FONTS.h4 }}>No Referrals</Text>
                        </View>
                    )
            }

            <Modal transparent visible={showFilter} animationType='slide' >
                <View style={{ backgroundColor: COLORS.gray, position: 'absolute', left: 0, right: 0, height: '70%', bottom: 0, borderTopEndRadius: 35, borderTopLeftRadius: 35, }}>
                    <TouchableOpacity style={{ position: 'absolute', top: 20, left: 30 }} onPress={() => setShowFilter(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginTop: 50, padding: SIZES.padding }}>

                        <FilterSwitcher title='New' value={filter.new} onValueChange={() => {
                            setFilter({ ...defaltFilter, new: true })
                            setDisposition('New')

                        }} />


                        <FilterSwitcher title='Pending' value={filter.pending} onValueChange={() => {
                            setFilter({ ...defaltFilter, pending: true })
                            setDisposition("Pending")

                        }
                        } />
                        <FilterSwitcher title='In Progress' value={filter.in_progress} onValueChange={() => {
                            setFilter({ ...defaltFilter, in_progress: true })
                            setDisposition('In Progress')

                        }
                        } />
                        <FilterSwitcher title='Closed' value={filter.closed} onValueChange={() => {
                            setFilter({ ...defaltFilter, closed: true })
                            setDisposition('Closed')

                        }

                        } />
                        <FilterSwitcher title='Not Sold' value={filter.not_sold} onValueChange={() => {
                            setFilter({ ...defaltFilter, not_sold: true })
                            setDisposition('Not Sold')

                        }

                        } />

                        <View>
                            <TouchableOpacity onPress={handleFilter} style={{ paddingVertical: 15, paddingHorizontal: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius * 3, justifyContent: 'center', alignItems: 'center', width: SIZES.width / 2, alignSelf: 'center', marginTop: 30 }}>
                                <Text style={{ ...FONTS.h3 }}>Apply Filter</Text>
                            </TouchableOpacity>
                        </View>

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
        backgroundColor: COLORS.background,



    }
})
