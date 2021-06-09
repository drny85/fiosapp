import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import EditReferral from '../screens/referrals/EditReferral';
import ReferralDetails from '../screens/referrals/ReferralDetails';
import Referrals from '../screens/referrals/Referrals';

const Stack = createSharedElementStackNavigator()


const ReferralsNavigation = () => {
    return (
        <Stack.Navigator mode='modal'>
            <Stack.Screen name='Referrals' options={{ headerShown: null }} component={Referrals} />
            <Stack.Screen name='ReferralDetails' component={ReferralDetails} options={{ title: 'Details' }} />
            <Stack.Screen name='EditReferral' component={EditReferral} options={{ title: 'Edit/Update' }} />

        </Stack.Navigator>
    )
}

export default ReferralsNavigation