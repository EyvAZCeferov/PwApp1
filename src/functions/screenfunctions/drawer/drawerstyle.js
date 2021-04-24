import React from "react";
import {View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import {Body, Left, ListItem, Right, Thumbnail} from "native-base";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";
import {
    AntDesign,
    Entypo,
    MaterialCommunityIcons,
    Foundation,
    FontAwesome,
} from "@expo/vector-icons";

const icon = require("../../../../assets/icon-ios.png");
import {t} from "../../lang";

const {width, height} = Dimensions.get("window");
import Textpopins from "../text";

export default function DrawerStyle(props) {
    return (
        <View>
            <StatusBar backgroundColor="#fff" style="dark"/>
            <SafeAreaView style={styles.container}>
                <ListItem style={{borderColor: "transparent", borderWidth: 0}}>
                    <Left>
                        <Thumbnail source={icon}/>
                    </Left>
                    <Body>
                        <Textpopins
                            style={{
                                fontSize: 17,
                                color: "#7c9d32",
                                fontFamily: "Poppins_400Regular",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            Eyvaz Cəfərov
                        </Textpopins>
                    </Body>
                    <Right/>
                </ListItem>

                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Home")}
                >
                    <Left>
                        <AntDesign
                            name="home"
                            size={24}
                            style={{fontWeight: "bold", textAlign: "right"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.home")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Cards")}
                >
                    <Left>
                        <AntDesign
                            name="creditcard"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.cards")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Bonuses")}
                >
                    <Left>
                        <Entypo
                            name="price-ribbon"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.bonuses")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Maps")}
                >
                    <Left>
                        <MaterialCommunityIcons
                            name="map"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.map")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("History")}
                >
                    <Left>
                        <FontAwesome
                            name="history"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.history")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Contactus")}
                >
                    <Left>
                        <Foundation
                            name="telephone"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.contactus")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity
                    style={styles.oneElement}
                    onPress={() => props.navigation.navigate("Settings")}
                >
                    <Left>
                        <AntDesign
                            name="setting"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.settings")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
                <TouchableOpacity style={styles.oneElement}>
                    <Left>
                        <AntDesign
                            name="logout"
                            size={24}
                            style={{fontWeight: "bold"}}
                            color="#7c9d32"
                        />
                    </Left>
                    <Body>
                        <Textpopins
                            style={styles.texts}
                        >
                            {t("drawer.logout")}
                        </Textpopins>
                    </Body>
                    <Right/>
                </TouchableOpacity>
                <View style={styles.seperator}/>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: height,
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#fff",
        flexWrap: "wrap",
    },
    oneElement: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-around",
        textAlign: "left",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        paddingLeft: Constants.statusBarHeight,
    },
    seperator: {
        width: "100%",
        marginVertical: 5,
        borderBottomColor: "#7c9d32",
        borderBottomWidth: 1.5,
    },
    texts: {
        fontSize: 16,
        color: "#7c9d32",
        fontFamily: "Poppins_400Regular",
        fontWeight: "bold",
        textAlign: "left",
        width: width/2,
        height:35,
        paddingTop:6,
        paddingLeft: Constants.statusBarHeight
    }
});
