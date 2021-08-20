
import React, { useEffect, useContext } from 'react';
import * as Notifications from 'expo-notifications';
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
import { useNotification } from './hooks/useNotification';
import NotesState from './context/notes/notesState';
import refereesContext from './context/referee/refereesContext';
import coachContext from './context/coach/coachContext';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

  }),
});



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
  const { getReferees } = useContext(refereesContext)
  const { getCoachs } = useContext(coachContext)

  useNotification()

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification.request.content);
    });
    const listener = auth.onAuthStateChanged(u => {

      if (u) {

        if (u.emailVerified) {
          setUser(u.uid)
          getReferrals(u.uid)
          getReferees(u.uid)
          getCoachs(u.uid)
        }

      }
    })



    //scheduleMotification('Hola', 'Welcome to yuor app', triger)

    return () => {
      listener && listener()
      subscription && subscription.remove();
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
            <NotesState>
              <App />
            </NotesState>
          </CoachsState>
        </RefereesState>
      </ManagersState>
    </ReferralsState>
  </AuthState>
}
