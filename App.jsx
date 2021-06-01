
import React, { useState, useEffect } from 'react';


import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, TabNavigation } from './navigation';
import { auth } from './database';
import { useFonts } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';


const App = () => {
  const [fontsLoaded, error] = useFonts({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "lobster": require('./assets/fonts/Lobster-Regular.ttf'),
    "tange": require("./assets/fonts/Tangerine-Regular.ttf"),

  })

  const [user, setUser] = useState(null)
  useEffect(() => {
    const listener = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u)
      }
    })
    return () => {
      listener && listener()
    }
  }, [])

  if (!fontsLoaded) return <AppLoading autoHideSplash={true} />
  return (
    <NavigationContainer>
      {user ?
        <TabNavigation /> :
        <AuthNavigator />
      }
    </NavigationContainer>
  )
}


export default () => {
  return <App />
}
