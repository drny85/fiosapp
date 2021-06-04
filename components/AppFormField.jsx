// @ts-nocheck
import React from "react";
import { useFormikContext } from "formik";
import AppInput from "./AppInput";
import AppErrorMessage from "./AppErrorMessage";

const AppFormField = ({ name, autoFocus, iconName, style, ...otherProps }) => {

    const {
        errors,
        touched,
        values,
        setFieldTouched,
        handleChange,
        setFieldValue,
    } = useFormikContext();

    return (
        <>
            <AppInput
                autoFocus={autoFocus}
                iconName={iconName}
                style={style}
                onBlur={() => setFieldTouched(values[name])}
                onChangeText={handleChange(name)}
                {...otherProps}
            />
            <AppErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    );
};

export default AppFormField;
