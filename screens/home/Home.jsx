import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import ScreenView from '../ScreenView'
import moment from 'moment'

import MiniInfoCard from '../../components/MiniInfoCard'


const Home = () => {
    const [quote, setQuote] = useState('')
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
    }, [])
    return (
        <ScreenView style={styles.container}>
            <View style={styles.dateView}>
                <Text style={{ ...FONTS.h4 }}>{moment().format('dddd, MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.mini}>
                <MiniInfoCard title="Today's Units" subtitle={5} />
                <MiniInfoCard title="Today's Units" subtitle={26} />
                <MiniInfoCard title="Today's Units" subtitle={0} />
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
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: SIZES.padding * 0.5,
    },
    quote: {
        shadowRadius: 8,
        shadowOpacity: 0.7,
        shadowOffset: {
            width: 3,
            height: 6
        },
        elevation: 8,
        shadowColor: COLORS.ascent,
        backgroundColor: COLORS.light,
        padding: SIZES.padding * 0.5,
        marginHorizontal: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
        marginTop: 10,
    }
})
