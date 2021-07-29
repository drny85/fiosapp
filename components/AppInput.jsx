import React, { useRef } from "react";
import { View, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/contantts";



const AppInput = ({ iconName, e = null, focus = false, onPressRightIcon, containerStyle, style, ...otherProps }) => {
    const inputRef = useRef()

    return (
        <TouchableWithoutFeedback onPress={() => {
            inputRef.current.focus()
        }}>
            <View style={[containerStyle]}>
                {iconName && (
                    <MaterialIcons
                        style={styles.icon}
                        size={24}
                        color={COLORS.secondary}
                        name={iconName}
                    />
                )}
                <TextInput

                    ref={inputRef}
                    autoFocus={focus}
                    autoCapitalize={e}
                    placeholderTextColor={COLORS.lightGray}
                    style={[styles.input, style]}
                    {...otherProps}
                />
                {onPressRightIcon && (
                    <MaterialIcons
                        style={[styles.icon, { position: 'absolute', right: 10, }]}
                        size={24}
                        onPress={onPressRightIcon}
                        color={COLORS.secondary}
                        name={'close'}
                    />
                )}

            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({

    icon: {
        marginRight: 10,
    },
    input: {
        borderBottomColor: COLORS.light,
        borderBottomWidth: 0.6,
        paddingVertical: SIZES.padding * 0.3,
        paddingHorizontal: SIZES.padding * 0.5,
        marginVertical: SIZES.padding * 0.5,
    },
});

export default AppInput;
