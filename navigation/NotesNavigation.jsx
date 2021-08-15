import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import HomeNotes from '../screens/notes/HomeNotes';
import Notes from '../screens/notes/Notes';
import Todos from '../screens/notes/Todos';


const Stack = createSharedElementStackNavigator()


const NotesNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='HomeNotes' component={HomeNotes} />
            <Stack.Screen name='Notes' component={Notes} />
            <Stack.Screen name='Todos' component={Todos} />
        </Stack.Navigator>
    )
}

export default NotesNavigation