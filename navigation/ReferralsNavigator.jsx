import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import MultiForm from '../screens/referrals/MultiForm';
import ReferralDetails from '../screens/referrals/ReferralDetails';
import Referrals from '../screens/referrals/Referrals';
import Spark from '../screens/referrals/Spark';



const Stack = createSharedElementStackNavigator()


const ReferralsNavigation = () => {
    return (
        <Stack.Navigator mode='modal'>
            <Stack.Screen name='Referrals' component={Referrals} />
            <Stack.Screen name='ReferralDetails' component={ReferralDetails} options={{ title: 'Details' }} />
            <Stack.Screen name='Spark' component={Spark} options={{ headerShown: false }} />
            <Stack.Screen name='AddReferralScreen' component={MultiForm} options={{ headerShown: null }} />


        </Stack.Navigator>
    )
}

export default ReferralsNavigation