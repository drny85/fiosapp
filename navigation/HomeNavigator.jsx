import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Home from '../screens/home/Home'



const Stack = createSharedElementStackNavigator()

const HomeNavigator = () => {
    return (<Stack.Navigator screenOptions={{ headerShown: null, headerTransparent: true, }}>
        <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
    )
}

export default HomeNavigator