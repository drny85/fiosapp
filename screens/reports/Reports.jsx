import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { AntDesign } from '@expo/vector-icons'
import AnimatedNumbers from 'react-native-animated-numbers';
import { Switch } from 'react-native-elements'

const Reports = () => {
    const [firstResponder, setFirstResponder] = useState(0)
    const [su, setSu] = useState(0)
    const [pm, setPm] = useState(0)
    const [dm, setDm] = useState(0)
    const [gm, setGm] = useState(0)
    const [jk, setJk] = useState(0)
    const [lines, setLines] = useState(0)
    const [autoPay, setAutoPay] = useState(10)
    const plans = [
        {
            id: 'start_unlimited',
            name: 'Start Unlimited',
            line: su,
            price: lines === 1 ? 80 - autoPay : lines === 2 ? 70 - autoPay : lines === 3 ? 55 - autoPay : lines === 4 ? 45 - autoPay : lines >= 5 ? 40 - autoPay : 0,
        },
        {
            id: 'play_more',
            name: 'Play More Unlimited',
            line: pm,
            price: lines === 1 ? 90 - autoPay : lines === 2 ? 80 - autoPay : lines === 3 ? 65 - autoPay : lines === 4 ? 55 - autoPay : lines >= 5 ? 50 - autoPay : 0,
        },
        {
            id: 'do_more',
            name: 'Do More Unlimited',
            line: dm,
            price: lines === 1 ? 90 - autoPay : lines === 2 ? 80 - autoPay : lines === 3 ? 65 - autoPay : lines === 4 ? 55 - autoPay : lines >= 5 ? 50 - autoPay : 0,
        },
        {
            id: 'get_more',
            name: 'Get More Unlimited',
            line: gm,
            price: lines === 1 ? 100 - autoPay : lines === 2 ? 90 - autoPay : lines === 3 ? 75 - autoPay : lines === 4 ? 65 - autoPay : lines >= 5 ? 60 - autoPay : 0,
        },
        {
            id: 'just_kids',
            name: 'Just Kids',
            line: jk,
            price: lines === 1 ? 0 : lines === 2 ? 60 - autoPay : lines === 3 ? 50 - autoPay : lines === 4 ? 45 - autoPay : lines >= 5 ? 35 - autoPay : 0,
        },
    ]

    const calculatePriceByLineMinus = (plan_id) => {
        switch (plan_id) {
            case 'start_unlimited':
                if (su > 0) {
                    setSu(prev => prev - 1)
                }
                break;
            case 'play_more':
                if (pm > 0) {
                    setPm(prev => prev - 1)
                }
                break;
            case 'do_more':
                if (dm > 0) {
                    setDm(prev => prev - 1)
                }
                break;
            case 'get_more':
                if (gm > 0) {
                    setGm(prev => prev - 1)
                }
                break;
            case 'just_kids':
                if (jk > 0) {
                    setJk(prev => prev - 1)
                }
                break;

            default:
                break;
        }
    }
    const calculatePriceByLinePlus = (plan_id) => {
        switch (plan_id) {
            case 'start_unlimited':
                if (su < 10) {
                    setSu(prev => prev + 1)
                }
                break;
            case 'play_more':
                if (pm < 10) {
                    setPm(prev => prev + 1)
                }
                break;
            case 'do_more':
                if (dm < 10) {
                    setDm(prev => prev + 1)
                }
                break;
            case 'get_more':
                if (gm < 10) {
                    setGm(prev => prev + 1)
                }
                break;
            case 'just_kids':
                if (jk < 10 && lines >= 1) {
                    setJk(prev => prev + 1)
                }
                break;

            default:
                break;
        }
    }

    const calculateTotalPriceBeforeTaxes = () => {
        return plans.reduce((pre, acc) => (acc.line * acc.price) + pre, 0)
    }


    const calculateEstTaxes = () => {
        const total = plans.reduce((pre, acc) => (acc.line * acc.price) + pre, 0)
        return total * 0.15

    }


    return (

        <View style={styles.view}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: SIZES.height / 15,
                maxHeight: 80,
                shadowRadius: 8,
                alignSelf: 'center',
                shadowOpacity: 0.7,
                shadowColor: COLORS.lightGray,
                borderRadius: SIZES.radius * 3,
                shadowOffset: { width: 3, height: 5 },
                backgroundColor: COLORS.gray,
                width: SIZES.width,
                marginVertical: 5
            }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={firstResponder === 0 ? { ...FONTS.body4 } : { ...FONTS.h4 }}>First Responder</Text>
                    <Switch style={{ marginLeft: 10 }} value={firstResponder > 10} trackColor={COLORS.light} thumbColor={COLORS.background} ios_backgroundColor={COLORS.light} color={COLORS.lightGray} onValueChange={v => setFirstResponder(prev => prev === 0 ? 15 : 0)} />
                </View>
                <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.background, borderRadius: SIZES.radius * 3 }}>
                    <Text style={{ ...FONTS.h3 }}>{lines} {lines > 1 ? 'Lines' : 'Line'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={autoPay === 0 ? { ...FONTS.body4 } : { ...FONTS.h4 }}>Auto Pay</Text>
                    <Switch style={{ marginLeft: 10 }} value={autoPay === 10} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setAutoPay(prev => prev === 0 ? 10 : 0)} />
                </View>
            </View>




            {plans.map(p => {
                return (
                    <View key={p.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 10 }}>
                        <View style={{ width: '40%' }}>
                            <Text style={{ textAlign: 'left', ...FONTS.h4 }}>{p.name}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', width: '35%' }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                height: 50,
                                shadowRadius: 8,
                                shadowOpacity: 0.7,
                                shadowColor: COLORS.card,
                                borderRadius: SIZES.radius * 3,
                                shadowOffset: { width: 3, height: 5 },
                                backgroundColor: COLORS.white,
                                width: SIZES.width / 3,
                                marginVertical: 5
                            }} >

                                <TouchableOpacity disabled={lines === 0 || p.line === 0} onPress={() => {
                                    if (lines > 0) {
                                        setLines(prev => prev - 1)
                                        calculatePriceByLineMinus(p.id)
                                    }
                                }

                                } style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <AntDesign name='minuscircleo' style={{ opacity: (lines === 0 || p.line === 0) ? 0.3 : 1 }} size={28} />
                                </TouchableOpacity>
                                <View>
                                    <Text style={{ ...FONTS.body3 }}>{p.line}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    if (p.id === 'just_kids' && lines === 0) return
                                    if (lines < 10) {
                                        setLines(prev => prev + 1)
                                        calculatePriceByLinePlus(p.id)
                                    }
                                }

                                } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                    <AntDesign name='pluscircleo' size={28} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 30 }}>
                            <AnimatedNumbers animationDuration={600} animateToNumber={`${p.price}`} fontStyle={{ ...FONTS.h3, }} />

                        </View>

                    </View>)
            })}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15, paddingRight: 30 }}>
                <Text style={{ ...FONTS.h3, }}>Sub Total: $</Text>
                <AnimatedNumbers animationDuration={600} animateToNumber={calculateTotalPriceBeforeTaxes()} fontStyle={{ ...FONTS.h3 }} />
            </View>
            <View style={{ paddingRight: 30 }}>
                {autoPay === 0 ? (<Text style={{ ...FONTS.body5, textAlign: 'right' }}>You can save ${lines * 10} with auto pay</Text>) : <Text style={{ ...FONTS.body5, textAlign: 'right' }}>You are saving ${lines * 10} with auto pay</Text>}

            </View>
            <View style={{ justifyContent: 'flex-end', paddingRight: 30, width: '100%' }}>
                <Text style={{ ...FONTS.h4, textAlign: 'right' }}>Estimated Taxes: ${calculateEstTaxes()} </Text>
                <Text style={{ ...FONTS.h3, textAlign: 'right' }}>Total Before Discount: $ {calculateTotalPriceBeforeTaxes() + calculateEstTaxes()} </Text>

            </View>


        </View>

    )
}

export default Reports

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginTop: SIZES.statusBarHeight

    }
})
