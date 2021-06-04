import React from 'react'

import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Managers from '../screens/profile/Managers'

const Stack = createSharedElementStackNavigator()
import Profile from '../screens/profile/Profile'

const ProfileNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='Managers' component={Managers} options={{ title: 'My Partners' }} />
        </Stack.Navigator>
    )
}


export default ProfileNavigation