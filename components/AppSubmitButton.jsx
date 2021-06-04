// @ts-nocheck
import React from "react";
import AppButton from "./AppButton";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";


const AppSubmitButton = ({ title, style, onPress, disabled }) => {
    const { handleSubmit } = useFormikContext();

    return (
        <AppButton
            style={[styles.container, style]}
            title={title}
            disabled={disabled}
            onPress={handleSubmit}
        />
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default AppSubmitButton;
