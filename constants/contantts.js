import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';

export const COLORS = {
	// colors
	black: '#1E1F20',
	white: '#FFFFFF',
	lightGray: '#ABAFB8',
	light: 'rgba(0, 0, 0, 0.12)',
	gray: '#BEC1D2',
	primary: '#f4f1de',
	secondary: '#3d405b',
	background: '#FFFFFF',
	ascent: '#ffe8d6',
	card: '#800f2f',
	placeHolderTextColor: '#808080',
	green: '#005f73',
	tile: '#ecf0f1',
	blue: '#337DFF',
	yellow: '#EEE253',
	lightText: '#f8f9fa',
	backgroundDisabled: '#61a5c2',
	white: '#f7f7f7',
	red: '#d00000',
	text: '#333333',
	progress: '#c2c955',
};

export const EXTRAS = {
	bonusOffer: 10,
};
export const TIER = {
	tier2: 9,
	tier3: 17,
};

export const SIZES = {
	// global sizes
	base: 8,
	font: 14,
	radius: 12,
	padding: 24,
	statusBarHeight: Constants.statusBarHeight,

	// font sizes

	h1: 30,
	h2: 22,
	h3: 16,
	h4: 14,
	h5: 12,
	body1: 30,
	body2: 20,
	body3: 16,
	body4: 14,
	body5: 12,

	// app dimensions
	width,
	height,
};

export const FONTS = {
	italic: { fontFamily: 'montserrat-bold-italic', fontSize: SIZES.body2 },
	h1: { fontFamily: 'montserrat-bold', fontSize: SIZES.h1, lineHeight: 36 },
	h2: { fontFamily: 'montserrat-bold', fontSize: SIZES.h2, lineHeight: 30 },
	h3: { fontFamily: 'montserrat-bold', fontSize: SIZES.h3, lineHeight: 22 },
	h4: { fontFamily: 'montserrat-bold', fontSize: SIZES.h4, lineHeight: 22 },
	h5: { fontFamily: 'montserrat-bold', fontSize: SIZES.h5, lineHeight: 22 },
	itemTitle: {
		fontFamily: 'montserrat-bold',
		fontSize: 20,
		lineHeight: 26,
		textTransform: 'capitalize',
		color: COLORS.secondary,
	},
	body1: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body1,
		lineHeight: 36,
	},
	body2: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body2,
		lineHeight: 30,
	},
	body3: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body3,
		lineHeight: 22,
	},
	body4: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body4,
		lineHeight: 22,
	},
	body5: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body5,
		lineHeight: 22,
	},
};

const appTheme = { COLORS, SIZES, FONTS, EXTRAS, TIER };

export default appTheme;
