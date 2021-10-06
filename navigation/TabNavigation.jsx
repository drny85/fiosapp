import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS } from '../constants/contantts'
import HomeNavigator from './HomeNavigator'
import ProfileNavigation from './ProfileNavigation'
import { MaterialIcons, Feather, Foundation, Ionicons } from '@expo/vector-icons';
import ReferralsNavigation from './ReferralsNavigator'
import NotesNavigation from './NotesNavigation'
import ReportsNavigation from './ReportsNavigation'

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tabs = createBottomTabNavigator()

const TabNavigation = () => {
    return (<Tabs.Navigator tabBarOptions={{

        inactiveTintColor: COLORS.white,
        activeTintColor: COLORS.black,
        activeBackgroundColor: COLORS.white,
        style: { backgroundColor: COLORS.card },

    }}>
        <Tabs.Screen name='HomeStack' options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route)
            return {
                title: 'Home',
                tabBarIcon: ({ color, size, focused }) => <MaterialIcons name="home" size={size} color={focused ? COLORS.black : COLORS.white} />,
                tabBarVisible: (routeName === 'AddReferralScreen' || routeName === 'Details') ? false : true
            }
        }} component={HomeNavigator} />
        <Tabs.Screen name='ReferralStack' options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route)
            return {
                title: 'Referrals', tabBarIcon: ({ color, size, focused }) => <Feather name="list" size={size} color={focused ? COLORS.black : COLORS.white} />,
                tabBarVisible: (routeName === 'AddReferralScreen' || routeName === 'ReferralDetails') ? false : true,
            }
        }} component={ReferralsNavigation} />

        <Tabs.Screen name='NotesStack' options={{
            title: 'Notes',
            tabBarIcon: ({ color, size, focused }) => <Foundation name="clipboard-notes" size={size} color={focused ? COLORS.black : COLORS.white} />
        }} component={NotesNavigation} />
        <Tabs.Screen name='ReportsStack' options={{
            title: 'Wireless',
            tabBarIcon: ({ color, size, focused }) =>
                <Ionicons name="cellular" size={size} color={focused ? COLORS.black : COLORS.white} />
        }}
            component={ReportsNavigation} />
        <Tabs.Screen name='ProfileStack' options={({ route }) => {

            return {
                title: 'Profile', tabBarIcon: ({ color, size, focused }) =>
                    <Feather name="user" size={size} color={focused ? COLORS.black : COLORS.white} />,
            }

        }} component={ProfileNavigation} />
    </Tabs.Navigator>
    )
}

export default TabNavigation