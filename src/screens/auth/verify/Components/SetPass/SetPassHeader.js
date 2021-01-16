import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {t} from "../../../../../../../Lang";
import {StatusBar} from "expo-status-bar";

export default class SetPassHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" style="dark" />
                <Text style={styles.header}>{t('settinganewpassword')}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "transparent",
        borderColor: "#fff",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    header: {
        color: "#7c9d32",
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
        paddingTop: 24,
    }
})