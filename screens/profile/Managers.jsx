import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

import { COLORS, FONTS, SIZES } from '../../constants/contantts'
import AddPersonModal from '../modals/AddPersonModal'
import refereesContext from '../../context/referee/refereesContext';
import { FlatList } from 'react-native';
import managersContext from '../../context/manager/managersContext';
import Loader from '../../components/Loader';
import PeopleCard from '../../components/PeopleCard';
import coachContext from '../../context/coach/coachContext';


const Managers = ({ navigation, route }) => {
    const { subject } = route.params;
    const [editing, setEditing] = useState(false)
    const [visible, setVisible] = useState(false)
    const [person, setPerson] = useState(null)
    const { referees, loadingReferees } = useContext(refereesContext)
    const { managers, loadingManagers, deleteManager } = useContext(managersContext)
    const { coachs, getCoachs, loadingCoach } = useContext(coachContext)


    let rowRefs = new Map();

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

    const handleDelete = useCallback(async (item) => {
        const { role, id, name } = item

        try {
            if (role === 'manager') {
                Alert.alert('Delete', `Do you want to delete ${name}`, [{ text: 'No', style: 'cancel', onPress: () => rowRefs.get(id).close() }, { text: 'Yes', style: 'destructive', onPress: () => deleteManager(item) }])
                await deleteManager(id)
            }
        } catch (error) {
            console.log(error.message)
        }
    }, [])

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

    // useEffect(() => {
    //     switch (subject) {
    //         case 'manager':
    //             getManagers(user?.id)
    //             break;
    //         case 'referee':
    //             getReferees(user?.id)
    //             break;
    //         case 'coach':
    //             getCoachs(user?.id)
    //             break;

    //         default:
    //             break;
    //     }
    // }, [subject, user])

    // useEffect(() => {
    //     switch (subject) {
    //         case 'manager':
    //             setData([...managers])
    //             break;
    //         case 'coach':
    //             setData([...coachs])
    //             break;
    //         case 'referee':
    //             setData([...referees])
    //         default:
    //             break;
    //     }


    // }, [subject, data.length])

    if (loadingReferees || loadingCoach || loadingManagers) return <Loader />
    return (
        <View style={styles.view}>



            <FlatList data={subject === 'manager' ? managers : subject === 'referee' ? referees : subject === 'coach' ? coachs : []} keyExtractor={item => item.id} renderItem={({ item }) => <PeopleCard ref={ref => {
                if (ref && !rowRefs.get(item.id)) {
                    rowRefs.set(item.id, ref)
                }
            }} onSwipeableWillOpen={() => {
                [...rowRefs.entries()].forEach(([key, ref]) => {
                    if (key !== item.id && ref) ref.close();
                });
            }} item={item} onEditPress={() => {
                setPerson(item)
                setEditing(true)
                setVisible(true)
            }}
                onDeletePress={() => handleDelete(item)}
                onPress={() => console.log('Work on people profile page')} />} />


            <AddPersonModal visible={visible} person={person} editing={editing} setVisible={() => setVisible(false)} setEditing={setEditing} selected={subject} />
        </View>
    )
}

export default Managers

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: COLORS.background

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
