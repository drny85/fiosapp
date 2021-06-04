import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AppErrorMessage = ({ error, visible }) => {
    if (!error || !visible) return null;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{error}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    text: {
        color: "red",
        paddingLeft: 10,
    },
});

export default AppErrorMessage;
