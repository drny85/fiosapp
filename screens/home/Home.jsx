import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import ScreenView from '../ScreenView'
import moment from 'moment'

import MiniInfoCard from '../../components/MiniInfoCard'
import referralsContext from '../../context/referrals/referralContext'


const Home = () => {
    const [quote, setQuote] = useState('')
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
                <MiniInfoCard title="Today's" subtitle={todayUnits.units} />
                <MiniInfoCard title="WTD Units" subtitle={wtdUnits.units} />
                <MiniInfoCard title="MTD Units" subtitle={mtdUnits.units} />
            </View>
            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Upcoming Moving</Text>
            <View style={styles.mini}>
                <MiniInfoCard title="Today" subtitle={movingToday.units} />
                <MiniInfoCard title="Tomorrow" subtitle={movingTomorrow.units} />
                <MiniInfoCard title="This Week" subtitle={movingThisWeek.units} />
            </View>
            <Text style={{ ...FONTS.h4, textAlign: 'center' }}>Upcoming Installations</Text>
            <View style={styles.mini}>
                <MiniInfoCard title="Today" subtitle={gettingInstalledToday.units} />
                <MiniInfoCard title="Tomorrow" subtitle={gettingInstalledTomorrow.units} />
                <MiniInfoCard onPress={() => { }} title="Today" subtitle={gettingInstalledThisWeek.units} />

            </View>
            {quote !== '' && (
                <View style={styles.quote}>
                    <Text style={{ ...FONTS.body4 }}>{quote.quote}</Text>
                    <Text style={{ textAlign: 'right', ...FONTS.h5, marginTop: 5, }}> -{quote.author}</Text>
                </View>
            )}


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
        backgroundColor: COLORS.light,
        padding: SIZES.padding * 0.5,
        marginHorizontal: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
        marginTop: 10,
    }
})
