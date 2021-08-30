import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'

import { COLORS, FONTS, SIZES, TIER } from '../../constants/contantts'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import MiniInfoCard from '../../components/MiniInfoCard'
import referralsContext from '../../context/referrals/referralContext'
import ReferralCard from '../../components/ReferralCard'
import useNotifications from '../../hooks/useNotifications'


const Home = ({ navigation }) => {
    useNotifications()
    const [quote, setQuote] = useState('')
    const [title, setTitle] = useState('')
    const [visible, setvisible] = useState(false)
    const [data, setData] = useState([])
    const { referrals,
        todayUnits,
        mtdUnits,
        wtdUnits,
        movingInTwoWeeks,
        movingToday,
        movingTomorrow,
        gettingInstalledThisWeek,
        calculateReferralUnits,
        calculateUpcomingInstallations,
        calculateMovingReferrals,
        gettingInstalledToday,
        gettingInstalledTomorrow } = useContext(referralsContext)
    const getTodayQuote = async () => {
        try {

            const res = await fetch('https://zenquotes.io/api/today')
            const data = await res.json()
            const quote = data[0].h.split(';')[1].split('&')[0];
            const author = data[0].a;
            setQuote({ author, quote })

        } catch (error) {
            console.log(error)
        }

    }

    const getTotal = (categoty) => {
        const total = referrals.filter(r => r.status.name === categoty).length
        const x = referrals.length
        return (total / x) * 100 ? (total / x) * 100 : null
    }


    useEffect(() => {
        //sendNot()
        getTodayQuote()
        calculateReferralUnits(referrals)
        calculateMovingReferrals(referrals)
        calculateUpcomingInstallations(referrals)

    }, [referrals.length])
    return (
        <ScrollView style={styles.container}>
            <View style={styles.dateView}>
                <Text style={{ ...FONTS.h4, marginTop: SIZES.padding * 0.5 }}>{moment().format('dddd, MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.mini}>
                <MiniInfoCard onPress={() => {
                    if (todayUnits.data.length === 0) return
                    setData(todayUnits.data)
                    setvisible(true)
                    setTitle('TODAY UNITS')
                }} title="Today's" show={true} tv={todayUnits.units.tv} subtitle={todayUnits.units.internet} />
                <MiniInfoCard onPress={() => {
                    if (wtdUnits.data.length === 0) return
                    setData(wtdUnits.data)
                    setvisible(true)
                    setTitle('WTD UNITS')
                }
                } title="WTD Units" show={true} tv={wtdUnits.units.tv} subtitle={wtdUnits.units.internet} />
                <MiniInfoCard onPress={() => {
                    if (mtdUnits.data.length === 0) return
                    setData(mtdUnits.data)
                    setvisible(true)
                    setTitle('MTD UNITS')
                }} title="MTD Units" show={true} tv={mtdUnits.units.tv} subtitle={mtdUnits.units.internet} />
            </View>
            <Animatable.View animation='fadeInDown' duration={800} delay={1000}>
                {wtdUnits.units.internet < TIER.tier2 && wtdUnits.units.internet !== 0 ? (
                    <Animatable.Text animation='fadeIn' numberOfLines={1} ellipsizeMode='tail' style={{ textAlign: 'center', ...FONTS.body4 }}>You are {(TIER.tier2 - wtdUnits.units) === 1 ? `${TIER.tier2 - wtdUnits.units.internet} unit away from tier 2. Go get them!` : `${TIER.tier2 - wtdUnits.units.internet} units away from tier 2. Go get them!`} </Animatable.Text>
                ) : wtdUnits.units.internet >= TIER.tier2 && wtdUnits.units.internet < TIER.tier3 ? (
                    <Animatable.Text numberOfLines={1} ellipsizeMode='tail' animation='fadeIn' style={{ textAlign: 'center', ...FONTS.body4 }}>Congratulations!, You made it to tier 2. {TIER.tier3 - wtdUnits.units.internet} more for tier 3</Animatable.Text>
                ) : wtdUnits.units.internet === 0 ? ( <Animatable.Text numberOfLines={1} ellipsizeMode='tail' animation='fadeIn' style={{ textAlign: 'center', ...FONTS.h4, color: COLORS.red }}>You have not units for this week. Let's Go!</Animatable.Text>): (
                            <Animatable.Text numberOfLines={1} ellipsizeMode='tail' animation='fadeIn' style={{ textAlign: 'center', ...FONTS.body4 }}>Congratulations!, You made it to tier 3</Animatable.Text>
                        )}

            </Animatable.View>
            <Text style={{ ...FONTS.h4, textAlign: 'center', marginTop: SIZES.padding * 0.5 }}>Upcoming Moving</Text>
            <View style={styles.mini}>
                <MiniInfoCard onPress={() => {
                    if (movingToday.data.length === 0) return
                    setData(movingToday.data)
                    setvisible(true)
                    setTitle('Moving Today')
                }} title="Today" subtitle={movingToday.units} />
                <MiniInfoCard onPress={() => {
                    if (movingTomorrow.data.length === 0) return
                    setData(movingTomorrow.data)
                    setvisible(true)
                    setTitle("Moving Tomorrow")
                }} title="Tomorrow" subtitle={movingTomorrow.units} />
                <MiniInfoCard onPress={() => {
                    if (movingInTwoWeeks.data.length === 0) return
                    setData(movingInTwoWeeks.data)
                    setvisible(true)
                    setTitle("In 2 Weeks")
                }} title="In 2 Weeks" subtitle={movingInTwoWeeks.units} />
            </View>
            <Text style={{ ...FONTS.h4, textAlign: 'center', marginTop: SIZES.padding * 0.5 }}>Upcoming Installations</Text>
            <View style={styles.mini}>
                <MiniInfoCard onPress={() => {
                    if (gettingInstalledToday.data.length === 0) return
                    setData(gettingInstalledToday.data)
                    setvisible(true)
                    setTitle("Today's Installs")
                }} title="Today" subtitle={gettingInstalledToday.units} />
                <MiniInfoCard onPress={() => {
                    if (gettingInstalledTomorrow.data.length === 0) return
                    setData(gettingInstalledTomorrow.data)
                    setvisible(true)
                    setTitle("Tomorrow's Installs")
                }} title="Tomorrow" subtitle={gettingInstalledTomorrow.units} />
                <MiniInfoCard onPress={() => {
                    if (gettingInstalledThisWeek.data.length === 0) return
                    setData(gettingInstalledThisWeek.data)
                    setvisible(true)
                    setTitle("This Week's Installs")
                }} title="This Week" subtitle={gettingInstalledThisWeek.units} />

            </View>
            {quote !== '' && (
                <View style={styles.quote}>
                    <Text style={{ ...FONTS.body4 }}>{quote.quote}</Text>
                    <Text style={{ textAlign: 'right', ...FONTS.h5, marginTop: 5, }}> -{quote.author}</Text>
                </View>
            )}

            <Text style={{ ...FONTS.h4, textAlign: 'center', marginTop: SIZES.padding * 0.5 }}>Referrals Disposition</Text>
            <View style={styles.mini}>
                <MiniInfoCard color={COLORS.blue} percentage={getTotal('New')} onPress={() => {
                    const refs = referrals.filter(r => r.status.name === 'New')
                    if (refs.length > 0) {
                        setData([...refs])
                        setvisible(true)
                        setTitle('New Referrals')
                    }

                }} title="New" subtitle={referrals.filter(r => r.status.name === 'New').length} />
                <MiniInfoCard color={COLORS.yellow} percentage={getTotal('Pending')} onPress={() => {
                    const refs = referrals.filter(r => r.status.name === 'Pending')
                    if (refs.length > 0) {
                        setData([...refs])
                        setvisible(true)
                        setTitle('Pending Referrals')
                    }
                }} title="Pending" subtitle={referrals.filter(r => r.status.name === 'Pending').length} />
                <MiniInfoCard color={COLORS.light} percentage={getTotal('In Progress')} onPress={() => {
                    const refs = referrals.filter(r => r.status.id === 'in_progress')
                    if (refs.length > 0) {
                        setData([...refs])
                        setvisible(true)
                        setTitle('Referrals In Progress')
                    }
                }} title="Progress" subtitle={referrals.filter(r => r.status.name === 'In Progress').length} />
                <MiniInfoCard color={COLORS.green} percentage={getTotal('Closed')} onPress={() => {
                    const refs = referrals.filter(r => r.status.name === 'Closed')
                    if (refs.length > 0) {
                        setData([...refs])
                        setvisible(true)
                        setTitle('Closed Referrals')
                    }
                }} title="Closed" subtitle={referrals.filter(r => r.status.name === 'Closed').length} />



            </View>

            <Modal animationType='slide' visible={visible}>
                <View style={{
                    flex: 1,
                    backgroundColor: COLORS.white,
                    marginTop: SIZES.statusBarHeight + 10,
                }}>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, position: 'absolute', top: 10, left: 25, elevation: 8, zIndex: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light, marginBottom: 20 }} onPress={() => setvisible(false)}>
                        <Ionicons name='close' size={26} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h3, textAlign: 'center', marginBottom: 20 }}>{title}</Text>
                    <FlatList contentContainerStyle={{ marginTop: 20 }} data={data.length > 0 && data} keyExtractor={item => item.id} renderItem={({ item }) => <ReferralCard onPress={() => {
                        setvisible(false)
                        navigation.navigate('Details', { id: item.id })
                    }} referral={item} />} />

                </View>
            </Modal>


        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginTop: SIZES.statusBarHeight,


    },
    dateView: {
        justifyContent: 'center', alignItems: 'center'
    },
    mini: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginHorizontal: SIZES.padding * 0.5,
        minWidth: SIZES.width / 2.8,
        width: SIZES.width * 0.96,
        alignSelf: 'center',



    },
    quote: {
        shadowRadius: 8,
        shadowOpacity: 0.7,
        shadowOffset: {
            width: 3,
            height: 6
        },
        // elevation: 8,
        width: 'auto',
        shadowColor: COLORS.ascent,
        backgroundColor: COLORS.card,
        padding: SIZES.padding * 0.5,
        marginHorizontal: SIZES.padding,
        borderRadius: SIZES.radius,
        marginTop: 10,

    }
})
