import React from 'react'
import { Text } from 'react-native'

import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { COLORS } from '../constants/contantts'
import ChatScreen from '../screens/chat/ChatScreen'
import Managers from '../screens/profile/Managers'
import PersonProfile from '../screens/profile/PersonProfile'

const Stack = createSharedElementStackNavigator()
import Profile from '../screens/profile/Profile'

const ProfileNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='PersonProfile' component={PersonProfile} options={({ route }) => ({ title: route.params?.person.name.split(' ')[0] })} />
            <Stack.Screen name='Managers' component={Managers} options={{ title: 'My Partners' }} />
        </Stack.Navigator>
    )
}


export default ProfileNavigation