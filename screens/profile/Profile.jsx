import React, { useCallback, useContext, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native'
import ScreenView from '../ScreenView'
import { COLORS, FONTS, SIZES } from '../../constants/contantts';

import authContext from '../../context/auth/authContext';
import ProfileListItem from '../../components/ProfileListItem';
import refereesContext from '../../context/referee/refereesContext';
import managersContext from '../../context/manager/managersContext';
import coachContext from '../../context/coach/coachContext';


const Profile = ({ navigation }) => {
    const { logout, user } = useContext(authContext)
    const { resetRefereeState, getReferees } = useContext(refereesContext)
    const { resetManagerState, getManagers } = useContext(managersContext)
    const { getCoachs, coachs } = useContext(coachContext)

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
            title: `${user ? user?.name.split(' ')[0] : ''}`,
            headerRight: () => (<TouchableOpacity onPress={logoutHandler} style={{ marginRight: 15, }}>
                <Text style={{ ...FONTS.h4, color: COLORS.lightGray }}>Log Out</Text>
            </TouchableOpacity>)
        })

        if (user) {
            getManagers(user.id)
            getReferees(user.id)
            getCoachs(user.id)
        }


    }, [navigation, user])
    return (
        <View style={styles.view}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: 200, height: 200, borderRadius: 100, backgroundColor: COLORS.light, alignSelf: 'center', marginVertical: 20 }}>
                {/* Profile picture section */}
                <Image resizeMode='cover' style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: SIZES.width }} source={{ uri: user?.imageUrl ? user.imageUrl : 'https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png' }} />
            </View>
            <View style={{ flex: 2 }}>
                <ProfileListItem tittle='Manage AMs' onPress={() => navigation.navigate('Managers', { subject: 'manager' })} />
                <ProfileListItem tittle='Manage Coach' onPress={() => navigation.navigate('Managers', { subject: 'coach' })} />
                <ProfileListItem tittle='Manage Referees' onPress={() => navigation.navigate('Managers', { subject: 'referee' })} />
                <ProfileListItem tittle='Chat Screen' onPress={() => navigation.navigate('Chat')} />
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    view: {
        flex: 1,
    }
})
