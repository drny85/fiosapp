import { EXTRAS } from '../constants/contantts';

export const mobilePlusHome = (
	rewards,
	totalLines,
	customerType,
	internetSpeed,
	bonusOffer = EXTRAS.bonusOffer
) => {
	if (totalLines === 0 || !rewards) return 0;

	switch (true) {
		case customerType === 'newNew' && internetSpeed === 'gigabit':
			return 15 + bonusOffer;
		case customerType === 'existing' && internetSpeed === 'gigabit':
			return 10 + bonusOffer;
		case customerType === 'newNew' &&
			(internetSpeed === '500' || internetSpeed === '300'):
			return 10 + bonusOffer;
		case customerType === 'existing' &&
			(internetSpeed === '500' || internetSpeed === '300'):
			return 5 + bonusOffer;

		default:
			return 0;
	}
};
