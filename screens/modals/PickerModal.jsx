import React from 'react';

import {
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
	FlatList,

} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/contantts';


const Picker = ({ data, onPress, showPicker, title }) => {

	return (
		<Modal animationType='slide' visible={showPicker}>
			<View style={styles.view}>
				<Text style={{ textAlign: 'center', ...FONTS.h3, marginBottom: 10 }}>
					Pick {title}
				</Text>
				<FlatList
					data={data}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.item}
							key={item.id}
							onPress={() => onPress(item)}
						>
							<View style={styles.icon}>
								<Text style={{ ...FONTS }}> {item.id.length === 2 ? (item.id) : (item.name.split(' ')[0][0])}</Text>
							</View>
							<View>
								<Text style={{ ...FONTS.body3 }}>
									{item.name}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</Modal>
	);
};

export default Picker;

const styles = StyleSheet.create({
	view: {
		flex: 1,
		marginTop: SIZES.statusBarHeight + 15,
		justifyContent: 'center',
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '98%',
		elevation: 10,
		shadowColor: COLORS.lightGray,
		shadowOffset: {
			width: 6,
			height: 8,
		},
		shadowOpacity: 0.7,
		shadowRadius: 8,
		backgroundColor: COLORS.background,
		paddingVertical: SIZES.padding * 0.2,
		paddingHorizontal: SIZES.padding,
		marginVertical: 5,
	},
	icon: {
		backgroundColor: COLORS.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		height: 60,
		width: 60,
		padding: SIZES.padding * 0.6,
		marginRight: 20,
	},
});
