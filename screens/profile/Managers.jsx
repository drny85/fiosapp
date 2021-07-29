import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox'
import { AntDesign } from '@expo/vector-icons';

import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import AppSubmitButton from '../../components/AppSubmitButton'
import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import * as Yup from 'yup'
import AddPersonModal from '../modals/AddPersonModal'


import referralsContext from '../../context/referrals/referralContext';
import refereesContext from '../../context/referee/refereesContext';
import { FlatList } from 'react-native';
import authContext from '../../context/auth/authContext';
import managersContext from '../../context/manager/managersContext';
import Loader from '../../components/Loader';
import PeopleCard from '../../components/PeopleCard';




const formSchema = Yup.object().shape({
    name: Yup.string().required().label('Full name'),
    phone: Yup.string().required().label('Phone'),
    email: Yup.string().email().required().label('Email')
})

const Managers = ({ navigation, route }) => {
    const { subject } = route.params;
    const [manager, setManager] = useState(true)
    const [visible, setVisible] = useState(false)
    const [coach, setCoach] = useState(false)
    const [referee, setReferee] = useState(false)
    const { user } = useContext(authContext)
    const { referees, getReferees } = useContext(refereesContext)
    const { managers, getManagers, loading } = useContext(managersContext)
    const { coachs, getCoachs } = useContext(managersContext)
    const [data, setData] = useState([])

    const title = () => {
        switch (subject) {
            case 'manager':
                return 'Managers'
            case 'referee':
                return 'Referees'
            case 'coach':
                return 'Coach'
            default:
                return subject
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title(),
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: SIZES.padding * 0.5 }} onPress={() => setVisible(true)}>
                    <AntDesign name="plus" size={28} color={COLORS.secondary} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    useEffect(() => {
        switch (subject) {
            case 'manager':
                getManagers(user?.id)
                if (managers.length > 0) {
                    setData([...managers])
                }

                break;
            case 'referee':
                getReferees(user?.id)
                if (referees.length > 0) {
                    setData([...referees])
                }
                break;

            default:
                break;
        }
    }, [subject])


    if (loading) return <Loader />
    return (
        <View style={styles.view}>

            {data?.length > 0 ? (

                <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <PeopleCard item={item} onPress={() => console.log(item.name)} />} />



            ) : (
                    <View>
                        <Text>No Data</Text>
                    </View>
                )}
            <AddPersonModal visible={visible} setVisible={() => setVisible(false)} selected={subject} />
        </View>
    )
}

export default Managers

const styles = StyleSheet.create({
    view: {
        flex: 1,

    },
    form: {
        width: '90%',
        marginTop: 30
    },
    checkbox: {
        flexDirection: 'row',
        width: '90%'
    }
})
