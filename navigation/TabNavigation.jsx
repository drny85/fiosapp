import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { COLORS } from '../constants/contantts'
import HomeNavigator from './HomeNavigator'
import ProfileNavigation from './ProfileNavigation'
import { MaterialIcons, Feather, Foundation, Ionicons } from '@expo/vector-icons';
import ReferralsNavigation from './ReferralsNavigator'



const Tabs = createBottomTabNavigator()

const TabNavigation = () => {
    return (<Tabs.Navigator tabBarOptions={{
        labelStyle: { color: COLORS.secondary, fontWeight: '600' },
        inactiveTintColor: COLORS.secondary,
        activeTintColor: COLORS.ascent,
        activeBackgroundColor: COLORS.light

    }}>
        <Tabs.Screen name='HomeStack' options={{ title: 'Home', tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} component={HomeNavigator} />
        <Tabs.Screen name='ReferralStack' options={{ title: 'Referrals', tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} /> }} component={ReferralsNavigation} />
        <Tabs.Screen name='NotesStack' options={{ title: 'Notes', tabBarIcon: ({ color, size }) => <Foundation name="clipboard-notes" size={size} color={color} /> }} component={ProfileNavigation} />
        <Tabs.Screen name='ReportsStack' options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} /> }} component={ProfileNavigation} />
        <Tabs.Screen name='ProfileStack' options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }} component={ProfileNavigation} />
    </Tabs.Navigator>
    )
}

export default TabNavigation