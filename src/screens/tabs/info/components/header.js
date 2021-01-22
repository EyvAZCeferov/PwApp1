import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Button, Header} from 'native-base';

const {width,height} = Dimensions.get('window');
import {AntDesign} from '@expo/vector-icons';
import {StatusBar} from "expo-status-bar";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from 'expo-constants'

export default class HeaderDrawer extends React.Component {

    render() {
        return (
            <Header style={styles.header}>
                <StatusBar backgroundColor="#fff" style="dark"/>
                <View style={styles.headerComponents}>
                    <Button
                        transparent
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <AntDesign name="menufold" size={24} color="#7c9d32"/>
                    </Button>
                    <Textpopins style={styles.title} children={this.props.name}/>
                    <View />
                </View>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        width,
        marginTop:Constants.statusBarHeight
    },
    headerComponents: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 0,
        color: '#7c9d32',
    },
});
