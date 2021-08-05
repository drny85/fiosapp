
import React from 'react'
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/contantts';

const NextPrevButton = ({ onPress, title, containerStyle, iconPosition, iconName, disabled }) => {


    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                containerStyle,
                {
                    backgroundColor: disabled ? '#ebeff5' : '#FFFFFF',
                    shadowColor: COLORS.ascent,
                    shadowOffset: { width: 3, height: 5 },
                    shadowOpacity: 0.6,
                    shadowRadius: 5,
                    elevation: 8,
                    borderRadius: 20,
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                    justifyContent: 'center', alignItems: 'center',
                    flexDirection: 'row'
                },
            ]}
            onPress={onPress}
        >
            {iconPosition === 'left' && (
                <Ionicons name={iconName ? iconName : "chevron-back"} size={24} color={COLORS.black} />
            )}
            <Text style={{ textTransform: 'capitalize', marginHorizontal: 10 }}>{title}</Text>
            {iconPosition === 'right' && (
                <Ionicons name={iconName ? iconName : "chevron-forward"} size={24} color={COLORS.black} />
            )}
        </TouchableOpacity>
    );
};

export default NextPrevButton;