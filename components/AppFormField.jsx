// @ts-nocheck
import React from "react";
import { useFormikContext } from "formik";
import AppInput from "./AppInput";
import AppErrorMessage from "./AppErrorMessage";

const AppFormField = ({ name, autoFocus, iconName, containerStyle, editing, style, ...otherProps }) => {

    const {
        errors,
        touched,
        values,
        setFieldTouched,
        setFieldValue,
    } = useFormikContext();

    return (
        <>
            <AppInput
                autoFocus={autoFocus}
                iconName={iconName}
                style={style}
                containerStyle={containerStyle}
                onBlur={() => setFieldTouched(values[name])}
                onChangeText={text => setFieldValue(name, text)}
                value={values[name]}

                {...otherProps}
            />
            <AppErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    );
};

export default AppFormField;
