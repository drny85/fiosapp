import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import Notes from '../screens/notes/Notes';



const Stack = createSharedElementStackNavigator()


const NotesNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Notes' component={Notes} />
        </Stack.Navigator>
    )
}

export default NotesNavigation