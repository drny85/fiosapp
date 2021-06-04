import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Reports from '../screens/reports/Reports'

const Stack = createSharedElementStackNavigator()

const ReportsNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Reports' component={Reports} options={{ headerShown: null }} />
        </Stack.Navigator>
    )
}

export default ReportsNavigation