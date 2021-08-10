import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Home from '../screens/home/Home'
import ReferralDetails from '../screens/referrals/ReferralDetails'



const Stack = createSharedElementStackNavigator()

const HomeNavigator = () => {
    return (<Stack.Navigator>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Details' component={ReferralDetails} options={{ title: 'Details' }} />
    </Stack.Navigator>
    )
}

export default HomeNavigator