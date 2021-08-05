import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const useNotification = () => {
	useEffect(() => {
		(async () => {
			const { granted } = await Notifications.getPermissionsAsync();
			if (!granted) return;
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Failed to get push token for push notification!');
				return;
			}

			if (Platform.OS === 'android') {
				Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C',
				});
			}
		})();
	}, []);
};
