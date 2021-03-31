import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {t} from "../../../../../functions/lang";
import {StatusBar} from "expo-status-bar";
import Constants from 'expo-constants';
export default class SetPassHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" style="dark" />
                <Text style={styles.header}>{t('loginregister.setpass.title')}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        marginTop:Constants.statusBarHeight,
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
        
    }
})