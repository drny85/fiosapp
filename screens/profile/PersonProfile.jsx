import React, { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import ReferralCard from '../../components/ReferralCard';
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import referralsContext from '../../context/referrals/referralContext';

const ReferralDetails = ({ item }) => {
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowRadius: 8, shadowOpacity: 0.7, shadowOffset: { width: 5, height: 6 }, backgroundColor: COLORS.background, paddingHorizontal: SIZES.padding * 0.5, marginVertical: 5, paddingVertical: 15 }}>
        <Text style={{ ...FONTS.body3 }}>{item.name}</Text>
        <Text>{item.phone}</Text>
    </View>
}

const PersonProfile = ({ route }) => {
    const { person } = route.params;
    const { referrals } = useContext(referralsContext)
    const [data, setData] = useState([])

    const getReferralByReferee = useCallback(() => {
        if (person.role === 'referee') {
            const res = referrals.filter(r => r.referee.id === person.id)
            setData(res)
        }

    }, [person.id])

    useLayoutEffect(() => {
        getReferralByReferee()

    }, [])
    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', paddingLeft: 20, marginTop: 10, paddingVertical: 10, shadowColor: COLORS.lightGray, shadowOffset: { width: 4, height: 6 }, backgroundColor: COLORS.background, width: '100%', shadowOpacity: 0.7, shadowRadius: 8 }}>
                <Text style={{ ...FONTS.body3, textTransform: 'capitalize', paddingVertical: 5, textAlign: 'left' }}>{person.name}</Text>
                <Text style={{ ...FONTS.body3, textTransform: 'capitalize', paddingVertical: 5 }}>{person.phone}</Text>
                <Text style={{ ...FONTS.body3, paddingVertical: 5 }}>{person.email}</Text>
                <Text style={{ ...FONTS.h4, textTransform: 'capitalize', paddingVertical: 5 }}>Role: <Text style={{ ...FONTS.body3 }}>{person.role}</Text></Text>
                {person.role === 'referee' && (<Text style={{ ...FONTS.h4 }}>Referrals Total: <Text style={{ ...FONTS.body3 }}>{data.length}</Text></Text>)}

            </View>
            <View style={{ flex: 1, marginVertical: 10 }}>

                {data.length > 0 && (
                    <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <ReferralDetails item={item} />} />
                )

                }

            </View>
        </View>
    )
}

export default PersonProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})
