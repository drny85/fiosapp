import React, { useContext, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import ScreenView from '../ScreenView'
import { COLORS, FONTS, SIZES } from '../../constants/contantts';

import authContext from '../../context/auth/authContext';
import ProfileListItem from '../../components/ProfileListItem';
import refereesContext from '../../context/referee/refereesContext';
import managersContext from '../../context/manager/managersContext';


const Profile = ({ navigation }) => {
    const { logout, user } = useContext(authContext)
    const { resetRefereeState } = useContext(refereesContext)
    const { resetManagerState } = useContext(managersContext)

    const logoutHandler = async () => {
        try {
            Alert.alert('Log Out', 'Are you sure you want ot log out?', [{
                text: 'Yes', onPress: async () => {
                    resetManagerState()
                    resetRefereeState()
                    logout()

                }
            }, { text: 'No', style: 'cancel' }])

            return true
        } catch (error) {
            console.log(error)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity onPress={logoutHandler} style={{ marginRight: 15, }}>
                <Text style={{ ...FONTS.h4, color: COLORS.lightGray }}>Log Out</Text>
            </TouchableOpacity>)
        })
    }, [navigation])
    return (
        <View style={styles.view}>
            <View>
                {/* Profile picture section */}
            </View>
            <ScreenView>
                <ProfileListItem tittle='Manage AMs' onPress={() => navigation.navigate('Managers', { subject: 'manager' })} />
                <ProfileListItem tittle='Manage Coach' onPress={() => navigation.navigate('Managers', { subject: 'coach' })} />
                <ProfileListItem tittle='Manage Referees' onPress={() => navigation.navigate('Managers', { subject: 'referee' })} />
            </ScreenView>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    view: {
        flex: 1,
    }
})
