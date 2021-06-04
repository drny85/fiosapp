import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Signin from '../screens/auth/Signin'
import Signup from '../screens/auth/Signup'
import Success from '../screens/auth/Success'

const Stack = createSharedElementStackNavigator()

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: null }}>
            <Stack.Screen name='Login' component={Signin} />
            <Stack.Screen name='Signup' component={Signup} />
            <Stack.Screen name='Success' component={Success} />
        </Stack.Navigator>
    )
}

export default AuthNavigator