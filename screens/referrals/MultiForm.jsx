import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Animated,
    Platform,
    TouchableNativeFeedback,
    Keyboard,
    SafeAreaView,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/contantts';
import referralsContext from '../../context/referrals/referralContext';
import managersContext from '../../context/manager/managersContext';
import refereesContext from '../../context/referee/refereesContext';
import * as Yup from 'yup'
import authContext from '../../context/auth/authContext';
import InputTextField from '../../components/InputTextField';
import { TouchableWithoutFeedback } from 'react-native';
import AppFormField from '../../components/AppFormField';
import AppForm from '../../components/AppForm';
import PickerModal from '../modals/PickerModal'

import NextPrevButton from '../../components/Forms/NextPrevButton';
import { isEmailValid } from '../../utils/isEmailValide';
import { formatPhone } from '../../utils/formatPhone';
import { states } from '../../states';
import { KeyboardAvoidingView } from 'react-native';
import ScreenView from '../ScreenView';
import { statuses } from '../../statuses';
import { services } from '../../services';


const data = [
    {
        id: 0,
        name: 'Customer',
    },
    { id: 1, name: 'Move' },
    {
        id: 2,
        name: 'Third',
    },

];

let REFERRAL = null;





const Paginator = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', height: 20 }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [15, 30, 15],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={i.toString()}
                        style={{
                            height: 5,
                            width: dotWidth,
                            borderRadius: 5,
                            marginHorizontal: 8,
                            backgroundColor: '#E85B05',
                            opacity,
                        }}
                    />
                );
            })}
        </View>
    );
};

const Step = ({ children }) => {
    return (
        <ScrollView style={{ flex: 1, width: '100%', height: '100%', padding: 10 }} con>
            {children}
        </ScrollView>
    );
};

const Page = ({ index, moveIn, internet, setInternet, mon, setMon, home, setHome, tv, setTv, setMoveIn, referralData, setReferralData, orderDate, setOrderDate, dueDate, setDueDate }) => {

    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(false)
    const [showPicker, setShowPicker] = useState(false)
    const [showAMs, setShowAms] = useState(false)
    const [showRE, setShowReferee] = useState(false)
    const { user } = useContext(authContext)
    const { addReferral, updateReferral } = useContext(referralsContext)
    const { managers, getManagers } = useContext(managersContext)
    const { referees, getReferees } = useContext(refereesContext)
    const [state, setState] = useState({ id: 'NY', name: 'New York' })


    const [pickStatus, setPickStatus] = useState(false);

    ///packages

    const [showInternetPicker, setShowInternetPicker] = useState(false)
    const [showTvPicker, setShowTvPicker] = useState(false)
    const [showHomePicker, setShowHomePicker] = useState(false)

    //const [moveIn, setMoveIn] = useState(new Date(new Date().getTime()))


    const populateCity = ({ nativeEvent }) => {
        let { text } = nativeEvent;
        switch (true) {
            case text.includes('107'):
                setReferralData({ ...referralData, city: 'Yonkers' })
                break;
            case text.includes('104'):
                setReferralData({ ...referralData, city: 'Bronx' })
                break;

            case text.includes('106'):
                setReferralData({ ...referralData, city: 'White Plains' })
                break;

            default:
                break;
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setMoveIn(currentDate);

    };
    const onChangeDueDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDueDate(currentDate);
    };
    const onChangeOrderDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setOrderDate(currentDate);
    };




    useEffect(() => {
        managers.length === 0 && getManagers(user?.userId)
        referees.length === 0 && getReferees(user?.userId)
        if (managers.length === 1) {
            setReferralData({ ...referralData, manager: managers[0] })
        }

        // if (initialValues) {

        //     setManager(initialValues.manager)
        //     setReferee(initialValues.referee)
        //     setMoveIn(new Date(new Date().getTime()))
        //     setState(initialValues.state)
        //     setStatus(initialValues.status)
        //     setComment(initialValues?.comment)
        //     setMon(initialValues.mon)
        //     setDueDate(new Date(new Date().getTime()))
        //     setOrderDate(new Date(new Date(initialValues.order_date).getTime()))
        //     setInternet(initialValues.package.internet)
        //     setTv(initialValues.package.tv)
        //     setHome(initialValues.package.home)
        // }

        return () => {

        }
    }, [user])




    if (loading) return <Loader />
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={50}
                style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    flex: 1,
                    width,
                    height,
                }}
            >
                {index === 0 && (
                    <Step
                        style={{
                            alignItems: 'center',
                            backgroundColor: 'red',
                            flex: 1,
                            width,
                            height,
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ flex: 1, }}>
                            <Text style={styles.title}>Customer's Info</Text>
                            <InputTextField name='name' autoCapitalize='words' placeholder="Customer's Full Name" onChangeText={text => setReferralData({ ...referralData, name: text })} value={referralData.name} />
                            <InputTextField name='phone' maxLength={14} placeholder="Phone Number" keyboardType='phone-pad' value={referralData.phone} onChangeText={text => setReferralData({ ...referralData, phone: formatPhone(text) })} />
                            <InputTextField name='email' placeholder="Email Address" autoCapitalize='none' keyboardType='email-address' onChangeText={text => setReferralData({ ...referralData, email: text.trim().toLowerCase() })} value={referralData.email} />
                            <View style={{ width: '98%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Move In Date:</Text>
                                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <DateTimePicker
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5, }}
                                            testID="dateTimePicker"
                                            value={moveIn}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onChange={onChange}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Step>
                )}
                {index === 1 && (
                    <Step>
                        <Text style={styles.title}>Property's Info</Text>
                        <InputTextField placeholder='Address, Ex 123 Main St' autoCompleteType='street-address' autoCapitalize='words' value={referralData.address} onChangeText={text => setReferralData({ ...referralData, address: text })} />
                        <InputTextField placeholder='Apt, Unit, Suite' autoCapitalize='words' value={referralData.apt} onChangeText={text => setReferralData({ ...referralData, apt: text.toUpperCase() })} />
                        <InputTextField placeholder='Zip Code' maxLength={5} keyboardType='numeric' value={referralData.zipcode} onBlur={populateCity} onChangeText={text => setReferralData({ ...referralData, zipcode: text })} />
                        <InputTextField placeholder='City' value={referralData.city} autoCapitalize='words' onChangeText={text => setReferralData({ ...referralData, city: text })} />
                        <InputTextField placeholder='State' value={state.id} autoCapitalize='words' onFocus={() => setShowPicker(true)} />

                    </Step>
                )}
                {index === 2 && (
                    <Step>
                        <Text style={styles.title}>Addiotional Info</Text>
                        <InputTextField placeholder='Referred By' value={referralData.referee.name} autoCapitalize='words' onFocus={() => setShowReferee(true)} />
                        <InputTextField placeholder='Account Manager - AM' value={referralData.manager.name} autoCapitalize='words' onFocus={() => setShowAms(true)} />
                        <InputTextField placeholder='Status' value={referralData.status.name} onFocus={() => setPickStatus(true)} />
                        {/* IF REFERRAL CHANGED TO CLOSED */}
                        {referralData.status.name === 'Closed' && (
                            <View>
                                <InputTextField placeholder='Master Order Number - MON' maxLength={13} value={mon} onChangeText={text => setMon(text.toUpperCase())} />
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Order Date:</Text>
                                        <DateTimePicker
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5 }}
                                            testID="dateTimePicker"
                                            value={orderDate}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onChange={onChangeOrderDate}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Due Date:</Text>
                                        <DateTimePicker
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5 }}
                                            testID="dateTimePicker"
                                            value={dueDate}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onChange={onChangeDueDate}
                                        />
                                    </View>


                                </View>
                                <View style={{ width: SIZES.width, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.h4 }}>Select Services Ordered:</Text>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => setShowInternetPicker(true)} style={[styles.pick, { backgroundColor: !showInternetPicker ? COLORS.background : COLORS.lightGray }]}>
                                            <Text style={{ ...FONTS.h5 }}>{internet ? internet.name : 'Internet'}</Text>
                                            {internet && (<TouchableHighlight style={styles.pickIcon} onPress={() => setInternet(null)}>
                                                <Text>x</Text>
                                            </TouchableHighlight>)}

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setShowTvPicker(true)} style={[styles.pick, { backgroundColor: showTvPicker ? COLORS.lightGray : COLORS.background }]}>
                                            <Text style={{ ...FONTS.h5 }}>{tv ? tv.name : 'TV'}</Text>
                                            {tv && (<TouchableHighlight style={styles.pickIcon} onPress={() => setTv(null)}>
                                                <Text>x</Text>
                                            </TouchableHighlight>)}

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setShowHomePicker(true)} style={[styles.pick, { backgroundColor: showHomePicker ? COLORS.lightGray : COLORS.background }]}>
                                            <Text style={{ ...FONTS.h5 }}>{home ? home.name : 'Home'}</Text>
                                            {home && (<TouchableHighlight style={styles.pickIcon} onPress={() => setHome(null)}>
                                                <Text>x</Text>
                                            </TouchableHighlight>)}

                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        <InputTextField placeholder='Notes, Comments' numberOfLines={5} multiline={true} style={{ height: SIZES.height / 6, borderWidth: 0.3, borderRadius: 8, borderColor: COLORS.lightGray }} value={referralData.comment} onChangeText={text => setReferralData({ ...referralData, comment: text })} />



                    </Step>
                )}

                <PickerModal data={states} showPicker={showPicker} title='State' onPress={(st) => {
                    setShowPicker(false)
                    // setState(st)
                    setReferralData({ ...referralData, state: st })
                }} />
                <PickerModal data={referees} showPicker={showRE} title='Referee' onPress={(referee) => {
                    setShowReferee(false)
                    //setReferee(referee)
                    setReferralData({ ...referralData, referee: referee })
                }} />

                <PickerModal data={managers} showPicker={showAMs} title='AM' onPress={(am) => {
                    setShowAms(false)
                    //setManager(am)
                    setReferralData({ ...referralData, manager: am })
                }} />

                <PickerModal data={statuses} showPicker={pickStatus} title='Status' onPress={(newStatus) => {
                    setPickStatus(false)
                    setStatus(newStatus)
                    setReferralData({ ...referralData, status: newStatus })
                }} />

                <PickerModal data={services[0].internet} showPicker={showInternetPicker} title='Internet' onPress={(int_serv) => {
                    setShowInternetPicker(false)
                    setInternet(int_serv)
                }} />
                <PickerModal data={services[1].tv} showPicker={showTvPicker} title='TV' onPress={(tv_serv) => {
                    setShowTvPicker(false)
                    setTv(tv_serv)
                }} />
                <PickerModal data={services[2].phone} showPicker={showHomePicker} title='Phone / Wiresss' onPress={(home_serv) => {
                    setShowHomePicker(false)
                    setHome(home_serv)
                }} />
            </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
    );
};



export default function MultiForm({ navigation, route }) {
    const { edit, referral } = route.params
    const [currentX, setCurrentX] = useState(0);
    const { user } = useContext(authContext)
    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 75 }).current;
    const slideRef = useRef();
    const [canContinue, setCanContinue] = useState(false)
    const { addReferral, updateReferral } = useContext(referralsContext)
    const [moveIn, setMoveIn] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [orderDate, setOrderDate] = useState(new Date())
    const [internet, setInternet] = useState(null)
    const [tv, setTv] = useState(null)
    const [home, setHome] = useState(null)
    const [mon, setMon] = useState('')
    const [status, setStatus] = useState({ id: 'new', name: 'New' })




    const [referralData, setReferralData] = useState({
        name: '',
        email: '',
        phone: '',
        moveIn: new Date(moveIn).toISOString(),
        address: '',
        apt: '',
        zipcode: '',
        city: '',
        state: { id: 'NY', name: 'New York' },
        referee: { name: '' },
        manager: { name: '' },
        status: { id: 'new', name: 'New' },
        comment: '',
        order_date: null,
        date_entered: new Date().toISOString(),
        due_date: null,
        package: null,
        updated: null,
        userId: user.id,
        mon: null,
        collateral_sent: false,
        collateral_sent_on: null,
        property: null,

    })


    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentX(viewableItems[0].index);
        }
    }).current;

    const _nextStep = () => {
        if (currentX < data.length - 1) {
            slideRef.current.scrollToIndex({ index: currentX + 1 });
            setCanContinue(false)
        }
    };

    const _prevStep = () => {
        if (currentX !== 0) {
            slideRef.current.scrollToIndex({ index: currentX - 1 });
        }
    };

    const handleSubmit = async () => {
        try {
            if (referralData.name.split(' ').length === 1) {
                alert("Please enter customer's full name")
                slideRef.current.scrollToIndex({ index: 0 })
                return
            }
            setReferralData({ ...referralData, moveIn: new Date(referralData.moveIn).toISOString() })
            if (referralData.comment.trimEnd().length === 0) {
                setReferralData({ ...referralData, comment: null })
            }
            if (edit && referral) {
                const referralCopy = { ...referralData }
                referralCopy.userId = user.id
                referralCopy.package = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? { internet, tv, home } : null;
                referralCopy.order_date = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? new Date(orderDate).toISOString() : null
                referralCopy.due_date = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? new Date(dueDate).toISOString() : null
                referralCopy.mon = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? mon : null
                if (referralData.status.name.toLowerCase() === 'closed') {
                    if (!internet && !tv && !home) {
                        alert('Please select the service that was ordered')
                        return;
                    } else if (mon === '' || mon.length < 13) {
                        alert("Please enter a valid order number - 'MON'")
                        return;
                    }
                }
                const updated = await updateReferral(referralCopy)
                if (updated) {
                    navigation.pop()
                }

            } else {
                const added = await addReferral(referralData)
                if (added) {

                    navigation.pop()
                } else return;
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if (currentX === 0) {
            if ((referralData.name.length > 5 && referralData.phone.length >= 14 && isEmailValid(referralData.email)) || (referralData.name.length > 5 && referralData.phone.length >= 14 && referralData.email.length === 0)) {

                setCanContinue(true)

            } else {
                setCanContinue(false)
            }
        }

        if (currentX === 1) {

            if (referralData.address.length > 5 && referralData.zipcode.length === 5 && referralData.city.length > 3 && referralData.state.name.length > 1) {
                setCanContinue(true)
            } else {
                setCanContinue(false)
            }
        }

        if (currentX === 2) {
            if (referralData.manager.name !== '' && referralData.referee.name !== '') {
                setCanContinue(true)


            } else {
                setCanContinue(false)
            }
        }


    }, [referralData, currentX, edit])


    useEffect(() => {

        if (edit && referral) {
            setReferralData(referral)
            setMoveIn(new Date(new Date(referral.moveIn).getTime()))

            if (referral.status.name.toLowerCase() === 'closed') {
                setDueDate(new Date(new Date(referral.due_date).getTime()))
                setOrderDate(new Date(new Date(referral.order_date).getTime()))
                setStatus(referral.status)
                setInternet(referral.package.internet)
                setMon(referral.mon)
                setTv(referral.package.tv)
                setHome(referral.package.home)
            }

        }

    }, [edit, referral])
    console.log(referral.status)


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: COLORS.white, elevation: 8, shadowColor: COLORS.card, shadowOffset: { width: 3, height: 5 }, shadowOpacity: 0.7, shadowRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Paginator data={data} scrollX={scrollX} />
                <Text></Text>
            </View>
            <View style={{ flex: 3 }}>
                <FlatList
                    ref={slideRef}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    viewabilityConfig={viewConfig}
                    onViewableItemsChanged={viewableItemsChanged}
                    bounces={false}
                    scrollEventThrottle={32}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ _, index }) => <Page index={index} mon={mon} status={status} setStatus={setStatus} setMon={setMon} tv={tv} setTv={setTv} internet={internet} setInternet={setInternet} home={home} setHome={setHome} dueDate={dueDate} setDueDate={setDueDate} orderDate={orderDate} setOrderDate={setOrderDate} canContinue={canContinue} moveIn={moveIn} setMoveIn={setMoveIn} setCanContinue={setCanContinue} referralData={referralData} setReferralData={setReferralData} />}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: '100%',
                }}
            >
                <NextPrevButton
                    iconPosition='left'
                    disabled={currentX === 0}
                    title='Prev'
                    onPress={_prevStep}
                    title='Prev'
                />
                {currentX < data.length - 1 && (
                    <NextPrevButton
                        iconPosition="right"
                        disabled={currentX === data.length - 1 || !canContinue}
                        title='Next'
                        onPress={_nextStep}
                    />

                )}

                {currentX === data.length - 1 && (
                    <NextPrevButton
                        iconPosition="left"
                        iconName='md-save'
                        disabled={!canContinue}
                        title={edit && referral ? 'Update Referral' : 'Save Referral'}
                        onPress={handleSubmit}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: { ...FONTS.h4, textAlign: 'center', marginBottom: 10, },

    pick: {
        shadowColor: COLORS.lightGray,
        shadowOffset: { width: 4, height: 6 },
        elevation: 8,
        shadowOpacity: 0.7,
        shadowRadius: 8,

        borderRadius: (SIZES.width / 3) / 2,
        width: SIZES.width / 3.2,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5,
        justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 4,
        marginHorizontal: 4
    },
    pickIcon: { height: 20, width: 20, borderRadius: 10, backgroundColor: COLORS.light, justifyContent: 'center', alignItems: 'center' }
});
