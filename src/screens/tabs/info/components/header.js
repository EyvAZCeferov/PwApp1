import React from "react";
import {Dimensions, StyleSheet} from "react-native";
import {Button, Header, Body} from "native-base";

const {width} = Dimensions.get("window");
import {Ionicons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";

export default class HeaderDrawer extends React.Component {
    render() {
        let marLeft = this.props.name.length * 4;
        return (
            <Header style={styles.header}>
                <StatusBar backgroundColor="#fff" style="dark"/>
                <Button
                    transparent
                    onPress={() => this.props.navigation.toggleDrawer()}
                >
                    <Ionicons name="menu" size={30} color="#5C0082"/>
                </Button>
                <Body style={styles.body}>
                    <Textpopins
                        style={[styles.title, {marginLeft: -marLeft}]}
                        children={this.props.name}
                    />
                </Body>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        width,
        marginTop: Constants.statusBarHeight,
    },
    headerComponents: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
        flex: 1,
    },
    body: {
        textAlign: "center",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        padding: 0,
        margin: 0,
        color: "#5C0082",
    },
});
