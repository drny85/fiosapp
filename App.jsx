
import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, TabNavigation } from './navigation';
import { auth } from './database';
import { View } from 'react-native'
import { useFonts } from '@expo-google-fonts/montserrat';
import ReferralsState from './context/referrals/referralsState';
import referralsContext from './context/referrals/referralContext';
import AuthState from './context/auth/authState';
import authContext from './context/auth/authContext';
import Loader from './components/Loader';
import ManagersState from './context/manager/managersState';
import RefereesState from './context/referee/refereesState';
import CoachsState from './context/coach/coachState';
import NotesState from './context/notes/notesState';
import refereesContext from './context/referee/refereesContext';
import coachContext from './context/coach/coachContext';


import LottieView from 'lottie-react-native';
const App = () => {

  const [fontsLoaded, error] = useFonts({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "lobster": require('./assets/fonts/Lobster-Regular.ttf'),
    "tange": require("./assets/fonts/Tangerine-Regular.ttf"),

  })
  const { getReferrals } = useContext(referralsContext)
  const { setUser, user, loading } = useContext(authContext)

  useEffect(() => {

    const listener = auth.onAuthStateChanged(u => {

      if (u) {

        if (u.emailVerified) {

          getReferrals(u.uid)

          setUser(u.uid)

        } else return;

      }
    })



    //scheduleMotification('Hola', 'Welcome to yuor app', triger)

    return () => {
      listener && listener()

    }
  }, [])


  if (!fontsLoaded || loading) {
    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView loop={false} autoPlay={true} resizeMode='contain' source={require('./assets/animations/welcome.json')} onAnimationFinish={() => {

      }} />
    </View>)
  }




  return (

    <NavigationContainer>
      {user && user.roles.active && !loading ? <TabNavigation /> : <AuthNavigator />}
    </NavigationContainer>

  )
}


export default () => {
  return <AuthState>
    <ReferralsState>
      <ManagersState>
        <RefereesState>
          <CoachsState>
            <NotesState>
              <App />
            </NotesState>
          </CoachsState>
        </RefereesState>
      </ManagersState>
    </ReferralsState>
  </AuthState>
}
