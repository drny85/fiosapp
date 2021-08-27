import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useContext, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Animated,
    Platform,
    Keyboard,
    SafeAreaView,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/contantts';
import referralsContext from '../../context/referrals/referralContext';
import managersContext from '../../context/manager/managersContext';
import refereesContext from '../../context/referee/refereesContext';
import authContext from '../../context/auth/authContext';
import InputTextField from '../../components/InputTextField';
import LottieView from 'lottie-react-native'
import * as Animatable from 'react-native-animatable';
import moment from 'moment'
import PickerModal from '../modals/PickerModal'

import NextPrevButton from '../../components/Forms/NextPrevButton';

import { isEmailValid } from '../../utils/isEmailValide';
import { formatPhone } from '../../utils/formatPhone';
import { statuses } from '../../statuses';
import { services } from '../../services';
import AddPersonModal from '../modals/AddPersonModal';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_KEY, EMAIL_URL } from '@env'
import { Modal } from 'react-native';



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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={60} style={{ flex: 1, width: SIZES.width, height: '100%', padding: 10 }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Page = ({ index, inputRef, monRef, edit, moveIn, status, setStatus, internet, setInternet, mon, setMon, wireless, setWireless, home, setHome, tv, setTv, setMoveIn, referralData, setReferralData, orderDate, setOrderDate, dueDate, setDueDate }) => {

    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(false)
    const [showDue, setShowDue] = useState(false)
    const [visible, setVisible] = useState(false)
    const [showPicker, setShowPicker] = useState(false)
    const [showAMs, setShowAms] = useState(false)
    const [showRE, setShowReferee] = useState(false)
    const { user } = useContext(authContext)
    const { managers, getManagers } = useContext(managersContext)
    const { referees, getReferees } = useContext(refereesContext)
    const [pickStatus, setPickStatus] = useState(false);
    const [show, setShow] = useState(false);

    const [showInternetPicker, setShowInternetPicker] = useState(false)
    const [showTvPicker, setShowTvPicker] = useState(false)
    const [showWirelessPicker, setShowWirelessPicker] = useState(false)
    const [showHomePicker, setShowHomePicker] = useState(false)
    const onChange = (_, selectedDate) => {

        const currentDate = selectedDate;
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            setMoveIn(currentDate);
        }


    };

    const onChangeDueDate = (_, selectedDate) => {
        const currentDate = selectedDate;
        setShow(Platform.OS === 'ios');
        setShowDue(false)
        if (currentDate) {
            setDueDate(currentDate);
        }

    };
    const onChangeOrderDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        //setShow(Platform.OS === 'ios');

        setShow(Platform.OS === 'ios')
        if (currentDate) {
            setOrderDate(currentDate);
        }

    };

    const getAddress = (_, { formatted_address }) => {

        setReferralData({ ...referralData, address: formatted_address })

    }
    
    useEffect(() => {
        managers.length === 0 && getManagers(user?.userId)
        referees.length === 0 && getReferees(user?.userId)
        inputRef.current.setAddressText(referralData.address)


        if (managers.length === 1) {
            setReferralData({ ...referralData, manager: managers[0] })
        }

        return () => {

        }
    }, [user, referees.length])

    if (loading) return <Loader />

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
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
                            <InputTextField name='phone' maxLength={14} placeholder="Phone Number" keyboardType='phone-pad' value={referralData.phone} onChangeText={text => {
                                setReferralData({ ...referralData, phone: formatPhone(text) })

                            }} />
                            <InputTextField name='email' placeholder="Email Address" autoCapitalize='none' keyboardType='email-address' onChangeText={text => setReferralData({ ...referralData, email: text.trim().toLowerCase() })} value={referralData.email} />
                            <View style={{ width: '98%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Move In Date:</Text>
                                    <TouchableHighlight underlayColor='transparent' activeOpacity={0} onPress={() => setShow(true)} style={{ flex: 1, borderBottomColor: COLORS.light, borderBottomWidth: 0.5, paddingHorizontal: SIZES.padding * 0.5, paddingVertical: SIZES.padding * 0.7 }}>
                                        <Text style={{ ...FONTS.body3 }}>{moment(moveIn).format('ll')}</Text>
                                    </TouchableHighlight>
                                    {Platform.OS === 'android' && show && (
                                        <DateTimePicker
                                            timeZoneOffsetInSeconds={0}
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                            testID="dateTimePicker"
                                            value={moveIn}
                                            minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                            mode='date'
                                            is24Hour={true}
                                            display='spinner'
                                            onChange={onChange}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        {Platform.OS === 'ios' && (
                            <Modal transparent animationType='slide' visible={show}>
                                <View style={{ backgroundColor: COLORS.background, position: 'absolute', left: 0, right: 0, height: SIZES.height / 2, bottom: 0, borderTopLeftRadius: SIZES.radius * 3, borderTopRightRadius: SIZES.radius * 3 }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: SIZES.padding, justifyContent: 'space-between', marginHorizontal: SIZES.padding * 2 }}>
                                        <TouchableHighlight onPress={() => setShow(false)}>
                                            <Text style={{ ...FONTS.body3, color: COLORS.red }}>Cancel</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={() => setShow(false)}>
                                            <Text style={{ ...FONTS.h3, color: 'blue' }}>Done</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{ flex: 1, marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>

                                        <DateTimePicker
                                            timeZoneOffsetInSeconds={0}
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                            testID="dateTimePicker"
                                            value={moveIn}
                                            minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                            mode='date'
                                            is24Hour={true}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={onChange}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        )}

                    </Step>
                )}
                {index === 1 && (
                    <View style={{ flex: 1, width: SIZES.width, }}>
                        <View style={{ padding: SIZES.padding * 0.5 }}>
                            <Text style={styles.title}>Property's Info</Text>

                            <GooglePlacesAutocomplete nearbyPlacesAPI='GooglePlacesSearch' fetchDetails={true} ref={inputRef} query={{ key: GOOGLE_MAPS_KEY, language: 'en', components: 'country:us' }} enablePoweredByContainer={false} onPress={getAddress} placeholder='Type Address' pla styles={{ container: { flex: 0 }, textInput: { ...FONTS.body4, borderBottomWidth: 0.5, borderBottomColor: COLORS.light } }} />
                            {referralData.address.length > 5 && (
                                <InputTextField
                                    style={{ marginTop: 50, }}
                                    placeholder="Apt, Unit, Suit, Floor" value={referralData.apt}
                                    onChangeText={text => setReferralData({ ...referralData, apt: text.toUpperCase() })} />
                            )}

                        </View>

                    </View>


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
                                <InputTextField ref={monRef} placeholder='Master Order Number - MON' maxLength={13} keyboardType={mon.length > 1 ? 'numeric' : 'default'} value={mon} style={{ ...FONTS.h3, letterSpacing: 1 }} onChangeText={text => setMon(text.toUpperCase())} />
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Order Date:</Text>
                                        <TouchableHighlight underlayColor='transparent' activeOpacity={0} onPress={() => setShow(true)} style={{ width: '95%', borderBottomColor: COLORS.light, borderBottomWidth: 0.5, paddingHorizontal: SIZES.padding * 0.5, paddingVertical: SIZES.padding * 0.7 }}>
                                            <Text style={{ ...FONTS.body3 }}>{moment(orderDate).format('ll')}</Text>
                                        </TouchableHighlight>
                                        {Platform.OS === 'android' && show && (
                                            <DateTimePicker
                                                timeZoneOffsetInSeconds={0}
                                                style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                                testID="dateTimePicker"
                                                value={orderDate}
                                                minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                                mode='date'
                                                is24Hour={true}
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={onChangeOrderDate}
                                            />)
                                        }

                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ ...FONTS.body3, marginHorizontal: SIZES.padding * 0.5 }}>Due Date:</Text>
                                        <TouchableHighlight underlayColor='transparent' activeOpacity={0} onPress={() => setShowDue(true)} style={{ width: '95%', borderBottomColor: COLORS.light, borderBottomWidth: 0.5, paddingHorizontal: SIZES.padding * 0.5, paddingVertical: SIZES.padding * 0.7 }}>
                                            <Text style={{ ...FONTS.body3 }}>{moment(dueDate).format('ll')}</Text>
                                        </TouchableHighlight>
                                        {Platform.OS === 'android' && showDue && (
                                            <DateTimePicker
                                                timeZoneOffsetInSeconds={0}
                                                style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                                testID="dateTimePicker"
                                                value={dueDate}
                                                minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                                mode='date'
                                                is24Hour={true}
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={onChangeDueDate}
                                            />)
                                        }
                                    </View>


                                </View>
                                <View style={{ width: '100%', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.h4 }}>Select Services Ordered:</Text>
                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignSelf: 'center' }}>
                                        <View style={{ width: '50%', }}>
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

                                        </View>
                                        <View style={{ width: '50%', }}>
                                            <TouchableOpacity onPress={() => setShowHomePicker(true)} style={[styles.pick, { backgroundColor: showHomePicker ? COLORS.lightGray : COLORS.background }]}>
                                                <Text style={{ ...FONTS.h5 }}>{home ? home.name : 'Home'}</Text>
                                                {home && (<TouchableHighlight style={styles.pickIcon} onPress={() => setHome(null)}>
                                                    <Text>x</Text>
                                                </TouchableHighlight>)}

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShowWirelessPicker(true)} style={[styles.pick, { backgroundColor: showTvPicker ? COLORS.lightGray : COLORS.background }]}>
                                                <Text style={{ ...FONTS.h5 }}>{wireless ? wireless.name : 'Wireless'}</Text>
                                                {wireless && (<TouchableHighlight style={styles.pickIcon} onPress={() => setWireless(null)}>
                                                    <Text>x</Text>
                                                </TouchableHighlight>)}

                                            </TouchableOpacity>

                                        </View>

                                    </View>
                                </View>
                            </View>
                        )}
                        <InputTextField placeholder='Notes, Comments' numberOfLines={5} multiline={true} style={{ height: SIZES.height / 6, borderWidth: 0.3, borderRadius: 8, borderColor: COLORS.lightGray, marginBottom: 50, }} value={referralData.comment} onChangeText={text => setReferralData({ ...referralData, comment: text })} />


                        {Platform.OS === 'ios' && (
                            <Modal transparent animationType='slide' visible={show || showDue}>
                                <View style={{ backgroundColor: COLORS.background, position: 'absolute', left: 0, right: 0, height: SIZES.height / 2, bottom: 0, borderTopLeftRadius: SIZES.radius * 3, borderTopRightRadius: SIZES.radius * 3 }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: SIZES.padding, justifyContent: 'space-between', marginHorizontal: SIZES.padding * 2 }}>
                                        <TouchableHighlight activeOpacity={0} underlayColor={COLORS.light} onPress={() => showDue ? setShowDue(false) : setShow(false)}>
                                            <Text style={{ ...FONTS.body3, color: COLORS.red }}>Cancel</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={() => showDue ? setShowDue(false) : setShow(false)}>
                                            <Text style={{ ...FONTS.h3, color: 'blue' }}>Done</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{ flex: 1, marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>

                                        <DateTimePicker
                                            timeZoneOffsetInSeconds={0}
                                            style={{ width: '90%', marginRight: SIZES.padding * 0.5, height: '100%' }}
                                            testID="dateTimePicker"
                                            value={showDue ? dueDate : orderDate}
                                            minimumDate={new Date(moment().subtract(1, 'year').format('YYYY-MM-DD'))}
                                            mode='date'
                                            is24Hour={true}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={showDue ? onChangeDueDate : onChangeOrderDate}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        )}

                    </Step>
                )}


                <AddPersonModal visible={visible} selected='referee' setVisible={setVisible} />

                <PickerModal data={referees} showPicker={showRE} actionRigthButton={
                    <TouchableOpacity onPress={() => {
                        setShowReferee(false)
                        setVisible(true)
                    }}>
                        <AntDesign name='plus' color={COLORS.black} size={24} />
                    </TouchableOpacity>
                } title='Referee' onPress={(referee) => {
                    setShowReferee(false)
                    //setReferee(referee)
                    setReferralData({ ...referralData, referee: referee })
                }} />

                <PickerModal data={managers} showPicker={showAMs} title='AM' onPress={(am) => {
                    setShowAms(false)
                    //setManager(am)
                    setReferralData({ ...referralData, manager: am })
                }} />

                <PickerModal data={edit ? statuses : statuses.filter(s => s.id !== 'closed')} showPicker={pickStatus} title='Status' onPress={(newStatus) => {
                    setPickStatus(false)
                    setStatus(newStatus)
                    setReferralData({ ...referralData, status: newStatus })

                    if (newStatus.name === 'Closed') {
                        console.log(monRef?.current)
                        monRef.current?.focus()
                    }
                }} />

                <PickerModal data={services[0].internet} showPicker={showInternetPicker} title='Internet' onPress={(int_serv) => {
                    setShowInternetPicker(false)
                    setInternet(int_serv)
                }} />
                <PickerModal data={services[1].tv} showPicker={showTvPicker} title='TV' onPress={(tv_serv) => {
                    setShowTvPicker(false)
                    setTv(tv_serv)
                }} />
                <PickerModal data={services[2].phone} showPicker={showHomePicker} title='Home Phone' onPress={(home_serv) => {
                    setShowHomePicker(false)
                    setHome(home_serv)
                }} />
                <PickerModal data={services[3].wireless} showPicker={showWirelessPicker} title='Wireless' onPress={(wireless_serv) => {
                    setShowWirelessPicker(false)
                    setWireless(wireless_serv)
                }} />
            </View>

        </TouchableWithoutFeedback>
    );
};



export default function MultiForm({ navigation, route }) {
    const { edit, referral } = route.params
    const [currentX, setCurrentX] = useState(0);
    const [submitting, setSubmitting] = useState(false)
    const [wasClosed, setWasClosed] = useState(false)
    const { user } = useContext(authContext)
    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 75 }).current;
    const slideRef = useRef();
    const inputRef = useRef();
    const monRef = useRef();
    const [canContinue, setCanContinue] = useState(false)
    const { addReferral, updateReferral } = useContext(referralsContext)
    const [moveIn, setMoveIn] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [orderDate, setOrderDate] = useState(new Date())
    const [internet, setInternet] = useState(null)
    const [tv, setTv] = useState(null)
    const [home, setHome] = useState(null)
    const [wireless, setWireless] = useState(null)
    const [success, setSuccess] = useState(false);
    const [mon, setMon] = useState('')
    const [status, setStatus] = useState({ id: 'new', name: 'New' })



    const [referralData, setReferralData] = useState({
        name: '',
        email: '',
        phone: '',
        moveIn: new Date(moveIn).toISOString(),
        address: '',
        apt: '',
        referee: { name: '' },
        manager: { name: '' },
        status: { id: 'new', name: 'New' },
        comment: null,
        order_date: null,
        date_entered: new Date().toISOString(),
        due_date: null,
        package: null,
        updated: null,
        userId: user.id,
        mon: null,
        email_sent: false,
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
            if (referralData.email === '') {
                setReferralData({ ...referralData, email: null })
            }

            referralData.moveIn = new Date(moveIn).toISOString()
            if (referralData.name.split(' ').length === 1) {
                alert("Please enter customer's full name")
                slideRef.current.scrollToIndex({ index: 0 })
                return
            }
            setSubmitting(true)
            setReferralData({ ...referralData, moveIn: new Date(referralData.moveIn).toISOString() })

            if (edit && referral) {
                const referralCopy = { ...referralData }
                referralCopy.userId = user.id
                referralCopy.updated = new Date().toISOString()
                referralCopy.package = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? { internet, tv, home, wireless } : null;
                referralCopy.order_date = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? new Date(orderDate).toISOString() : null
                referralCopy.due_date = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? new Date(dueDate).toISOString() : null
                referralCopy.mon = edit && referral && referralData.status.name.toLowerCase() === 'closed' ? mon : null
                if (referralData.status.name.toLowerCase() === 'closed') {
                    if (!internet && !tv && !home && !wireless) {
                        alert('Please select the service that was ordered')
                        return;
                    } else if (mon === '' || mon.length < 13) {
                        alert("Please enter a valid order number - 'MON'")
                        return;
                    }
                }

                const updated = await updateReferral(referralCopy)
                if (updated) {
                    if (referralCopy.status.name.toLowerCase() === 'closed') {
                        setSuccess(true)
                        if (wasClosed) {
                            navigation.pop()
                        }
                        // const sent = await sendEmail({ referral: referralCopy })
                        // console.log('EMAIL SENT', sent)
                    } else {
                        navigation.pop()
                    }

                }

            } else {

                const added = await addReferral(referralData)

                if (added) {

                    navigation.navigate('Referrals')
                } else return;
            }

        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {

        if (currentX === 0) {
            if ((referralData.name.length > 5 && referralData.phone.length >= 14 && isEmailValid(referralData.email)) || (referralData.name.length > 5 && referralData.phone.length >= 14)) {

                setCanContinue(true)

            } else {
                setCanContinue(false)
            }
        }

        if (currentX === 1) {

            if (referralData.address.length > 5) {
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

        // if (currentX === 0) {
        //     slideRef.current.scrollToIndex({ index: currentX + 2 });
        // }


    }, [referralData, currentX, edit])


    useEffect(() => {

        if (edit && referral) {
            setReferralData(referral)
            setMoveIn(new Date(new Date(referral.moveIn).getTime()))
            if (referral.address) {
                inputRef.current?.setAddressText(referral.address)
            }

            if (referral.status.name.toLowerCase() === 'closed') {
                setDueDate(new Date(new Date(referral.due_date).getTime()))
                setOrderDate(new Date(new Date(referral.order_date).getTime()))
                setStatus(referral.status)
                setWasClosed(true)
                setInternet(referral.package.internet)
                setMon(referral.mon)
                setTv(referral.package.tv)
                setHome(referral.package.home)
                setWireless(referral.package.wireless)
            }

        }


    }, [edit, referral])

    if (success && !wasClosed) return <View style={{ flex: 1, marginTop: SIZES.statusBarHeight }}>
        <LottieView style={{ flex: 1, }} resizeMode='contain' source={require('../../assets/animations/congratulations.json')} autoPlay />
        <Animatable.View animation='fadeIn' duration={2000} style={{ position: 'absolute', bottom: 100, left: 0, right: 0 }}>
            <Animatable.Text animation='slideInDown' style={{ ...FONTS.body4, textAlign: 'center' }}>Remember to send your Closed Sale email</Animatable.Text>
            <Animatable.View animation='slideInUp' duration={1000} easing='ease-in-out' style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
                <TouchableOpacity style={{
                    shadowColor: COLORS.lightGray, shadowOffset: { width: 5, height: 6 }, elevation: 8,
                    shadowOpacity: 0.7, shadowRadius: 6, justifyContent: 'center', alignItems: 'center',
                    paddingHorizontal: 25, paddingVertical: 10, backgroundColor: COLORS.white,
                    borderRadius: SIZES.radius * 3
                }}
                    onPress={() => {
                        setSuccess(false)
                        navigation.pop()
                    }}>
                    <Text style={{ ...FONTS.body4 }}>Send Later</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    shadowColor: COLORS.lightGray,
                    shadowOffset: { width: 5, height: 6 },
                    elevation: 8, shadowOpacity: 0.7, shadowRadius: 6,
                    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 25,
                    paddingVertical: 10, backgroundColor: COLORS.white, borderRadius: SIZES.radius * 3
                }}
                    onPress={() => {
                        setSuccess(false)
                        navigation.pop()
                        navigation.navigate('Spark')
                    }}>
                    <Animatable.Text animation='shake' style={{ ...FONTS.h4 }}>Send Now</Animatable.Text>
                </TouchableOpacity>
            </Animatable.View>
        </Animatable.View>
    </View>


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', zIndex: 99, top: 15, left: 20, height: 40, width: 40, borderRadius: 20, backgroundColor: COLORS.white, elevation: 8, shadowColor: COLORS.card, shadowOffset: { width: 3, height: 5 }, shadowOpacity: 0.7, shadowRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>


            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <Paginator data={data} scrollX={scrollX} />
            </View>
            <View style={{ width: SIZES.width }}>
                <FlatList
                    ref={slideRef}
                    keyboardShouldPersistTaps={'handled'}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    contentContainerStyle={{ marginTop: 40, }}
                    scrollEnabled={canContinue}
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
                    renderItem={({ _, index }) => <Page index={index} monRef={monRef} inputRef={inputRef} mon={mon} status={status} edit={edit} setStatus={setStatus} setMon={setMon} tv={tv} wireless={wireless} setWireless={setWireless} setTv={setTv} internet={internet} setInternet={setInternet} home={home} setHome={setHome} dueDate={dueDate} setDueDate={setDueDate} orderDate={orderDate} setOrderDate={setOrderDate} canContinue={canContinue} moveIn={moveIn} setMoveIn={setMoveIn} setCanContinue={setCanContinue} referralData={referralData} setReferralData={setReferralData} />}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 60,


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
                        disabled={!canContinue || submitting}
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
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.statusBarHeight
    },

    title: { ...FONTS.h4, textAlign: 'center', marginBottom: 10, },

    pick: {
        shadowColor: COLORS.lightGray,
        shadowOffset: { width: 4, height: 6 },
        elevation: 8,
        shadowOpacity: 0.7,
        shadowRadius: 8,

        borderRadius: (SIZES.width / 3) / 2,
        width: SIZES.width / 2.2,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5,
        justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 4,
        marginHorizontal: 4
    },
    pickIcon: { height: 20, width: 20, borderRadius: 10, backgroundColor: COLORS.light, justifyContent: 'center', alignItems: 'center' }
});
