import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import ScreenView from '../ScreenView'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'

import MiniInfoCard from '../../components/MiniInfoCard'
import referralsContext from '../../context/referrals/referralContext'
import ReferralCard from '../../components/ReferralCard'
import { scheduleMotification } from '../../hooks/scheduleNotification'




const Home = ({ navigation }) => {
    const [quote, setQuote] = useState('')
    const [title, setTitle] = useState('')
    const [visible, setvisible] = useState(false)
    const [data, setData] = useState([])
    const { referrals,
        todayUnits,
        mtdUnits,
        wtdUnits,
        movingThisWeek,
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





    useEffect(() => {
        getTodayQuote()
        calculateReferralUnits(referrals)
        calculateMovingReferrals(referrals)
        calculateUpcomingInstallations(referrals)




    }, [referrals.length])
    return (
        <ScreenView style={styles.container}>
            <View style={styles.dateView}>
                <Text style={{ ...FONTS.h4 }}>{moment().format('dddd, MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.mini}>
                <MiniInfoCard onPress={() => {
                    if (todayUnits.data.length === 0) return
                    setData(todayUnits.data)
                    setvisible(true)
                    setTitle('TODAY UNITS')
                }} title="Today's" subtitle={todayUnits.units} />
                <MiniInfoCard onPress={() => {
                    if (wtdUnits.data.length === 0) return
                    setData(wtdUnits.data)
                    setvisible(true)
                    setTitle('WTD UNITS')
                }
                } title="WTD Units" subtitle={wtdUnits.units} />
                <MiniInfoCard onPress={() => {
                    if (mtdUnits.data.length === 0) return
                    setData(mtdUnits.data)
                    setvisible(true)
                    setTitle('MTD UNITS')
                }} title="MTD Units" subtitle={mtdUnits.units} />
            </View>
            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Upcoming Moving</Text>
            <View style={styles.mini}>
                <MiniInfoCard onPress={() => {
                    if (movingToday.data.length === 0) return
                    setData(movingToday.data)
                    setvisible(true)
                    setTitle('Moving Today')
                }} title="Today" subtitle={movingToday.units} />
                <MiniInfoCard onPress={() => {
                    if (movingTomorrow.data.length === 0) return
                    setData(movingToday.data)
                    setvisible(true)
                    setTitle("Moving Tomorrow")
                }} title="Tomorrow" subtitle={movingTomorrow.units} />
                <MiniInfoCard onPress={() => {
                    if (movingThisWeek.data.length === 0) return
                    setData(movingThisWeek.data)
                    setvisible(true)
                    setTitle("Moving This Week")
                }} title="This Week" subtitle={movingThisWeek.units} />
            </View>
            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Upcoming Installations</Text>
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

            <Modal animationType='slide' visible={visible}>
                <View style={{
                    flex: 1,
                    backgroundColor: COLORS.white,
                    marginTop: SIZES.statusBarHeight + 10,
                }}>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, position: 'absolute', top: 10, left: 25, elevation: 8, zIndex: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light, }} onPress={() => setvisible(false)}>
                        <Ionicons name='close' size={26} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h3, textAlign: 'center' }}>{title}</Text>
                    <FlatList contentContainerStyle={{ marginTop: 20 }} data={data.length > 0 && data} keyExtractor={item => item.id} renderItem={({ item }) => <ReferralCard onPress={() => {
                        setvisible(false)
                        navigation.navigate('Details', { id: item.id })
                    }} referral={item} />} />

                </View>
            </Modal>


        </ScreenView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1


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
        shadowColor: COLORS.ascent,
        backgroundColor: COLORS.background,
        padding: SIZES.padding * 0.5,
        marginHorizontal: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
        marginTop: 10,
    }
})
