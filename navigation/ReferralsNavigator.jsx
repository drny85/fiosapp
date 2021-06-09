import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import ReferralDetails from '../screens/referrals/ReferralDetails';
import Referrals from '../screens/referrals/Referrals';

const Stack = createSharedElementStackNavigator()


const ReferralsNavigation = () => {
    return (
        <Stack.Navigator mode='modal'>
            <Stack.Screen name='Referrals' options={{ headerShown: null }} component={Referrals} />
            <Stack.Screen name='ReferralDetails' component={ReferralDetails} options={{ title: 'Details' }} />
            

        </Stack.Navigator>
    )
}

export default ReferralsNavigation