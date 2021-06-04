import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/contantts";


const AppButton = ({ title, onPress, style, textStyle, disabled = false }) => {
    return (
        <TouchableOpacity style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]} disabled={disabled} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.secondary,
        borderRadius: 25,
        width: "100%",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontWeight: "700",
        textTransform: "uppercase",
        fontSize: 20,
    },
});

export default AppButton;
