import * as Notifications from 'expo-notifications';
import { useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { auth } from 'firebase';
import Constant from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import authContext from '../context/auth/authContext';
import { db } from '../database';

Notifications.setNotificationHandler({
	handleNotification: async (notification) => {
		const { data } = notification.request.content;
		if (data.notificationType === 'new_message') {
			return {
				shouldShowAlert: false,
				shouldPlaySound: false,
				shouldSetBadge: false,
			};
		} else {
			return {
				shouldShowAlert: true,
				shouldPlaySound: false,
				shouldSetBadge: false,
			};
		}
	},
});

let pushToken = null;
const useNotifications = () => {
	const naviagtion = useNavigation();
	const { saveExpoPushToken } = useContext(authContext);

	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync();

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				const { data } = notification.request.content;
				// if (!data) return;
				// if (data?.notificationType === 'referral') {
				// 	const { name, params } = data.referralData;
				// 	naviagtion.navigate(name, params);
				// }

				//naviagtion.navigate(data?.screen, data?.params)
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				const { content } = response.notification.request;
				const { data } = content;
				if (!data) return;
				if (data?.notificationType === 'referral') {
					const { name, params } = data.referralData;
					naviagtion.navigate(name, params);
				}
				if (data?.notificationType === 'new_message') {
					naviagtion.navigate('ProfileStack', { screen: 'Chat' });
				}
			});

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	const saveToken = async (id, token) => {
		saveExpoPushToken(id, token);
	};

	const registerForPushNotificationsAsync = async () => {
		try {
			if (Constant.isDevice) {
				const { status: existingStatus } =
					await Notifications.requestPermissionsAsync();
				let finalStatus = existingStatus;
				if (existingStatus !== 'granted') {
					const { status } = await Notifications.getPermissionsAsync();
					finalStatus = status;
				}

				if (finalStatus !== 'granted') {
					alert('Failed to get push token for push notification!');
					return;
				}
				const token = (await Notifications.getExpoPushTokenAsync()).data;
				const id = auth().currentUser.uid;
				if (!id) return;
				const signedUser = await db.collection('users').doc(id).get();
				const alreadySigned = signedUser.data()?.pushToken;

				if (alreadySigned) return;
				saveToken(id, token);
			}

			if (Platform.OS === 'android') {
				Notifications.createChannelAndroidAsync('default', {
					name: 'default',
					sound: true,
					priority: 'max',
					vibrate: [0, 250, 250, 250],
				});
			}
		} catch (error) {
			console.log('Error from useNotifications hooks', error);
		}
	};
};

export default useNotifications;
