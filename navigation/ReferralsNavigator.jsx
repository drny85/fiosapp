import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import Referrals from '../screens/referrals/Referrals';

const Stack = createSharedElementStackNavigator()


const ReferralsNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: null }}>
            <Stack.Screen name='Referrals' component={Referrals} />

        </Stack.Navigator>
    )
}

export default ReferralsNavigation