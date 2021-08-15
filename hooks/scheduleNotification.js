import * as Notifications from 'expo-notifications';
import moment from 'moment';

export const scheduleMotification = async (title, body, time) => {
	try {
		const notification = await Notifications.scheduleNotificationAsync({
			content: {
				title: title,
				body: body,
				autoDismiss: true,
			},
			trigger: {
				seconds: moment(time).diff(new Date(), 'seconds'),
			},
		});
	} catch (error) {
		console.log('@Error at scheduleNotification', error);
	}
};
