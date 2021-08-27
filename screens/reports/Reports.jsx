import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, Alert, TouchableHighlight, Modal } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import { AntDesign } from '@expo/vector-icons'
import AnimatedNumbers from 'react-native-animated-numbers';
import { Divider, Switch } from 'react-native-elements'
import { firstResponderDiscount } from '../../utils/firstResponderDiscount'

import { mobilePlusHome } from '../../utils/mobilePlusHome'

const ACTIVATION_FEE = 35;

const Reports = () => {
    const [firstResponder, setFirstResponder] = useState(false)
    const [rewards, setRewards] = useState(false)
    const [show, setShow] = useState(false)
    const [customerType, setCustomerType] = useState(null)
    const [internetSpeed, setInternetSpeed] = useState(null)
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

    const resetAll = () => {
        setCustomerType(null)
        setAutoPay(0)
        setDm(0)
        setSu(0)
        setJk(0)
        setPm(0)
        setGm(0)
        setInternetSpeed(null)
        setRewards(false)
        setLines(0)
        setFirstResponder(false)

    }

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
        return (total + (lines * ACTIVATION_FEE) + (autoPay ? lines * 10 : 0)) * 0.15

    }
    const calculateEstTaxesWithFirstResponder = () => {
        const total = plans.reduce((pre, acc) => (acc.line * acc.price) + pre, 0)
        return (total - firstResponderDiscount(lines, firstResponder) - mobilePlusHome(rewards, lines, customerType, internetSpeed)) * 0.15

    }

    const handleResetAll = () => {
        return Alert.alert('Reset', 'Do you want to start from scratch?', [{ text: 'No', style: 'cancel' }, { text: 'Yes', style: 'destructive', onPress: resetAll }])
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
                backgroundColor: COLORS.card,
                width: SIZES.width,
                marginVertical: 5
            }}>
                <TouchableWithoutFeedback onLongPress={handleResetAll}>
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={firstResponder === 0 ? { ...FONTS.body4 } : { ...FONTS.h4 }}>1st Responder</Text>
                            <Switch style={{ marginLeft: 10 }} value={firstResponder} trackColor={COLORS.light} thumbColor={COLORS.background} ios_backgroundColor={COLORS.light} color={COLORS.lightGray} onValueChange={v => setFirstResponder(prev => !prev)} />
                        </View>
                        <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.background, borderRadius: SIZES.radius * 3 }}>
                            <Text style={{ ...FONTS.h3 }}>{lines} {lines > 1 ? 'Lines' : 'Line'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={autoPay === 0 ? { ...FONTS.body4 } : { ...FONTS.h4 }}>Auto Pay</Text>
                            <Switch style={{ marginLeft: 10 }} value={autoPay === 10} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setAutoPay(prev => prev === 0 ? 10 : 0)} />
                        </View>
                    </>
                </TouchableWithoutFeedback>
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
                                    <Text style={{ ...FONTS.h4 }}>{p.line}</Text>
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

                    </View>

                )
            })}

            <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                <Divider subHeader='Price Before Discount / First Month' subHeaderStyle={{ textAlign: 'center' }} color={COLORS.lightGray} width={1.2} style={{ marginTop: 20 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15, paddingRight: 30 }}>
                    <Text style={{ ...FONTS.h3, }}>Sub Total: $</Text>
                    <AnimatedNumbers animationDuration={600} animateToNumber={calculateTotalPriceBeforeTaxes() + (autoPay ? lines * 10 : 0)} fontStyle={{ ...FONTS.h3 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 30 }}>
                    <Text style={{ ...FONTS.body3, }}>Activation Fee: $</Text>
                    <AnimatedNumbers animationDuration={600} animateToNumber={lines * ACTIVATION_FEE} fontStyle={{ ...FONTS.body3 }} />
                </View>


                <View style={{ justifyContent: 'flex-end', paddingRight: 30, width: '100%' }}>
                    <Text style={{ ...FONTS.body4, textAlign: 'right' }}>Estimated Taxes: ${calculateEstTaxes()} </Text>
                    <Text style={{ ...FONTS.h3, textAlign: 'right' }}>Total Before Discount: $ {calculateTotalPriceBeforeTaxes() + calculateEstTaxes() + (lines * ACTIVATION_FEE) + (autoPay ? lines * 10 : 0)} </Text>
                </View>
                <Divider subHeader='Price After Additional Discount' subHeaderStyle={{ textAlign: 'center', marginBottom: 10 }} color={COLORS.lightGray} width={1.2} style={{ marginTop: 20 }} />
                {/* PRICE AFTER DISCOUNT */}


                <View style={{ backgroundColor: COLORS.light, paddingVertical: SIZES.padding * 0.5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 30 }}>
                        <Text style={{ ...FONTS.h3, }}>Sub Total: $</Text>
                        <AnimatedNumbers animationDuration={600} animateToNumber={calculateTotalPriceBeforeTaxes()} fontStyle={{ ...FONTS.h3 }} />
                    </View>
                    <View style={{ paddingRight: 30 }}>
                        {autoPay === 0 ? (<Text style={{ ...FONTS.body4, textAlign: 'right' }}>You can save ${lines * 10} with auto pay</Text>) : <Text style={{ ...FONTS.body4, textAlign: 'right' }}>You are saving ${lines * 10} with auto pay</Text>}

                    </View>
                    {firstResponder && (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, paddingRight: 30 }}>
                            <Text style={{ ...FONTS.body4, }}>1st Responder Discount: -$</Text>
                            <AnimatedNumbers animationDuration={600} animateToNumber={firstResponderDiscount(lines, firstResponder)} fontStyle={{ ...FONTS.body4 }} />
                        </View>
                    )}
                    {rewards && (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15, paddingRight: 30 }}>
                            <Text style={{ ...FONTS.body4, }}>M + H Rewards: -$</Text>
                            <AnimatedNumbers animationDuration={600} animateToNumber={mobilePlusHome(rewards, lines, customerType, internetSpeed)} fontStyle={{ ...FONTS.body4 }} />
                        </View>
                    )}
                    <View style={{ justifyContent: 'flex-end', paddingRight: 30, width: '100%' }}>
                        <Text style={{ ...FONTS.body4, textAlign: 'right' }}>Estimated Taxes: ${calculateEstTaxesWithFirstResponder()} </Text>
                        <Text style={{ ...FONTS.h3, textAlign: 'right' }}>Total Price After Discount: $ <Text style={{ ...FONTS.h2 }}>{calculateTotalPriceBeforeTaxes() + calculateEstTaxesWithFirstResponder() - firstResponderDiscount(lines, firstResponder) - mobilePlusHome(rewards, lines, customerType, internetSpeed)} </Text> </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ ...FONTS.h3, textAlign: 'center', marginVertical: 10 }}>Total Saving: $</Text>
                        <AnimatedNumbers animationDuration={600} animateToNumber={+(firstResponderDiscount(lines, firstResponder) + mobilePlusHome(rewards, lines, customerType, internetSpeed) + (autoPay ? lines * 10 : 0)).toFixed(2)} fontStyle={{ ...FONTS.h1 }} />
                    </View>
                </View>

                <Divider subHeader='Mobile + Home Rewards' subHeaderStyle={{ textAlign: 'center', marginBottom: 10 }} color={COLORS.lightGray} width={1.2} style={{ marginTop: 20 }} />
                <View>
                    {rewards && (
                        <TouchableOpacity onPress={() => setShow(true)} style={{ justifyContent: 'center', alignItems: 'center', width: 'auto', marginBottom: 20, paddingVertical: SIZES.padding * 0.5, paddingHorizontal: 6, shadowColor: COLORS.card, shadowOffset: { width: 5, height: 6 }, elevation: 6, borderRadius: SIZES.radius * 3, backgroundColor: COLORS.card, shadowOpacity: 0.6, shadowRadius: 8 }}>
                            <Text style={{ ...FONTS.h4, color: COLORS.blue }}>Apply M + H Discounts</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                        <Text style={autoPay === 0 ? { ...FONTS.body4 } : { ...FONTS.h4 }}>Is Home + Rewards Eligible ?</Text>
                        <Switch disabled={lines === 0} style={{ marginLeft: 10 }} value={rewards} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setRewards(prev => !prev)} />
                    </View>




                </View>
            </ScrollView>
            <Modal visible={show} transparent animationType='slide'>
                <View style={{ position: 'absolute', left: 0, right: 0, backgroundColor: COLORS.background, flex: 1, height: SIZES.height * 0.8, bottom: 0, borderTopEndRadius: 35, borderTopLeftRadius: 35, shadowOffset: { width: 5, height: 8 }, elevation: 8, shadowColor: COLORS.black, shadowRadius: 20, shadowOpacity: 0.7 }}>
                    <TouchableHighlight underlayColor={COLORS.gray} style={{ justifyContent: 'center', alignItems: 'flex-end', zIndex: 110, paddingHorizontal: 30, paddingVertical: 15 }} onPress={() => setShow(false)}>
                        <Text style={{ ...FONTS.h4, color: COLORS.blue }}>Done</Text>
                    </TouchableHighlight>
                    <View>
                        <Text style={{ ...FONTS.body2, textAlign: 'center' }}>M + H Discount: ${mobilePlusHome(rewards, lines, customerType, internetSpeed)}</Text>
                        <Divider />
                    </View>
                    <View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ ...FONTS.h2, marginBottom: 20 }}>Customer Type</Text>
                        <View style={{ flexDirection: 'row', marginBottom: SIZES.padding, width: SIZES.width / 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>Is New / New ?</Text>
                            <Switch style={{ marginLeft: 10 }} value={customerType === 'newNew'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setCustomerType('newNew')} />

                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: SIZES.padding, alignItems: 'center', width: SIZES.width / 2, justifyContent: 'flex-end' }}>
                            <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>Is Existing?</Text>
                            <Switch style={{ marginLeft: 10 }} value={customerType === 'existing'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setCustomerType('existing')} />

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: SIZES.width / 2, justifyContent: 'flex-end' }}>
                            <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>Is Just New</Text>
                            <Switch style={{ marginLeft: 10 }} value={customerType === 'justNew'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => {
                                setCustomerType('justNew')
                                setInternetSpeed(null)
                            }} />

                        </View>



                    </View>
                    {customerType !== 'justNew' && (
                        <>
                            <Divider insetType='middle' inset={true} color={COLORS.lightGray} style={{ marginVertical: 10 }} />
                            <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', ...FONTS.h2, marginBottom: 20 }}>What Internet Speed?</Text>
                                <View style={{ flexDirection: 'row', marginBottom: SIZES.padding, width: SIZES.width / 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>200 or 300 Mbps</Text>
                                    <Switch style={{ marginLeft: 10 }} value={internetSpeed === '300'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setInternetSpeed('300')} />

                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: SIZES.padding, alignItems: 'center', width: SIZES.width / 2, justifyContent: 'flex-end' }}>
                                    <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>400 or 500 Mbps</Text>
                                    <Switch style={{ marginLeft: 10 }} value={internetSpeed === '500'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={() => setInternetSpeed('500')} />

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: SIZES.width / 2, justifyContent: 'flex-end' }}>
                                    <Text style={{ ...FONTS.h3, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>Gigabit 940 /880 Mbps</Text>
                                    <Switch style={{ marginLeft: 10 }} value={internetSpeed === 'gigabit'} trackColor={COLORS.light} ios_backgroundColor={COLORS.light} thumbColor={COLORS.background} color={COLORS.light} onValueChange={v => setInternetSpeed('gigabit')} />

                                </View>
                            </View>
                        </>
                    )}


                </View>
            </Modal>



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
