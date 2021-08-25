import React from 'react'

import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import ChatScreen from '../screens/chat/ChatScreen'
import Managers from '../screens/profile/Managers'

const Stack = createSharedElementStackNavigator()
import Profile from '../screens/profile/Profile'

const ProfileNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='Managers' component={Managers} options={{ title: 'My Partners' }} />
        </Stack.Navigator>
    )
}


export default ProfileNavigation