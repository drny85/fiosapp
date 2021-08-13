import axios from 'axios';
import { EMAIL_URL } from '@env';

export const sendEmail = async (referral) => {
	console.log(EMAIL_URL);
	if (!referral) return;

	try {
		const res = await axios.post(
			'https://us-central1-fiosrewards.cloudfunctions.net/onEmailSent/send',
			referral
		);
		return res.status === 200;
	} catch (error) {
		console.log('Error sending email', error);
	}
};
