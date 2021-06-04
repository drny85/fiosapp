import React from "react";
import { StyleSheet, View } from "react-native";


const Divider = ({ color }) => {
    return <View style={[styles.view, { backgroundColor: color }]}></View>;
};

export default Divider;

const styles = StyleSheet.create({
    view: {
        width: "95%",
        height: 0.4,

        justifyContent: "center",
        alignSelf: "center",

        opacity: 0.4,
        elevation: 10,
        margin: 10,
    },
});
