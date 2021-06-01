import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import ScreenView from '../ScreenView'
import { AntDesign } from '@expo/vector-icons';
import { SIZES } from '../../constants/contantts';

const Profile = () => {

    const logout = async () => {
        try {
            await auth.signOut()
            return true
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ScreenView>
            <View style={styles.topView}>
                <TouchableOpacity>

                    <AntDesign name="left" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Log Out</Text>
                    <AntDesign style={{ marginLeft: 10 }} name="logout" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </ScreenView>
    )
}

export default Profile

const styles = StyleSheet.create({
    topView: {
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: SIZES.padding
    }
})
