
import React, {useEffect, useContext } from 'react';


import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, TabNavigation } from './navigation';
import { auth } from './database';
import { useFonts } from '@expo-google-fonts/montserrat';
import ReferralsState from './context/referrals/referralsState';
import referralsContext from './context/referrals/referralContext';
import AuthState from './context/auth/authState';
import authContext from './context/auth/authContext';
import Loader from './components/Loader';
import ManagersState from './context/manager/managersState';
import RefereesState from './context/referee/refereesState';
import CoachsState from './context/coach/coachState';


const App = () => {

  const [fontsLoaded, error] = useFonts({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "lobster": require('./assets/fonts/Lobster-Regular.ttf'),
    "tange": require("./assets/fonts/Tangerine-Regular.ttf"),

  })
  const { getReferrals } = useContext(referralsContext)
  const { setUser, user, logout, loading } = useContext(authContext)


  useEffect(() => {
    const listener = auth.onAuthStateChanged(u => {

      if (u) {

        if (u.emailVerified) {
          setUser(u.uid)
          getReferrals(u.uid)
        }

      }
    })

    return () => {
      listener && listener()
    }
  }, [])

  if (!fontsLoaded) return <Loader />


  return (

    <NavigationContainer>
      {loading ? <Loader /> : user && user.roles.active ? <TabNavigation /> : <AuthNavigator />}
    </NavigationContainer>

  )
}


export default () => {
  return <AuthState>
    <ReferralsState>
      <ManagersState>
        <RefereesState>
          <CoachsState>
            <App />
          </CoachsState>
        </RefereesState>
      </ManagersState>
    </ReferralsState>
  </AuthState>
}
