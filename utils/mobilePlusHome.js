import moment from 'moment';

export const mobilePlusHome = (
	rewards,
	totalLines,
	customerType,
	internetSpeed
) => {
	let bonusOffer = 0;
	if (totalLines === 0 || !rewards) return 0;

	if (moment().isAfter(moment('20211130', 'YYYYMMDD').startOf('day'))) {
		bonusOffer = 0;
	}

	switch (true) {
		case customerType === 'newNew' && internetSpeed === 'gigabit':
			bonusOffer = 5;
			return 10 + bonusOffer;
		case customerType === 'existing' && internetSpeed === 'gigabit':
			bonusOffer = 0;
			return 10 + bonusOffer;
		case customerType === 'newNew' &&
			(internetSpeed === '500' || internetSpeed === '300'):
			bonusOffer = 5;
			return 5 + bonusOffer;
		case customerType === 'existing' &&
			(internetSpeed === '500' || internetSpeed === '300'):
			bonusOffer = 0;
			return 5 + bonusOffer;

		default:
			return 0;
	}
};
