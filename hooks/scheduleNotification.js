import * as Notifications from 'expo-notifications';

export const scheduleMotification = async (title, body, time) => {
	try {
		const notification = await Notifications.scheduleNotificationAsync({
			content: {
				title: title,
				body: body,
				autoDismiss: true,
			},
			trigger: {
				seconds: time,
			},
		});
	} catch (error) {
		console.log('@Error at scheduleNotification', error);
	}
};
