import * as Notifications from 'expo-notifications';
import moment from 'moment';

export const scheduleMotification = async (title, body, data, date) => {
	try {
		if (moment(date).diff(new Date(), 'seconds') < 1) {
			alert('select a time in the future');
			return;
		}
		const notification = await Notifications.scheduleNotificationAsync({
			content: {
				title: title,
				body: body,
				autoDismiss: true,
				data: data,
				sound: true,
				vibrate: [0, 250, 250, 250],
			},
			trigger: {
				seconds: moment(date).diff(new Date(), 'seconds'),
			},
		});
	} catch (error) {
		console.log('@Error at scheduleNotification', error);
	}
};
