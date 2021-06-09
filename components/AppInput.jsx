import React, { useRef } from "react";
import { View, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/contantts";



const AppInput = ({ iconName, e = null, focus = false, onPressRightIcon, containerStyle, style, ...otherProps }) => {
    const inputRef = useRef()

    return (
        <TouchableWithoutFeedback onPress={() => {
            inputRef.current.focus()
        }}>
            <View style={[styles.container, containerStyle]}>
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
    container: {

        height: 50,
        marginVertical: 12,
        padding: 8,
        borderRadius: 25,
        alignItems: "center",
        backgroundColor: COLORS.tile,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        color: COLORS.black,
        fontSize: 18,
        paddingHorizontal: 10,

        height: "100%",
    },
});

export default AppInput;
