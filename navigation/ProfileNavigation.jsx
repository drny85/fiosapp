import React from 'react'

import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

const Stack = createSharedElementStackNavigator()
import Profile from '../screens/profile/Profile'

const ProfileNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: null }}>
            <Stack.Screen name='Profile' component={Profile} />
        </Stack.Navigator>
    )
}


export default ProfileNavigation