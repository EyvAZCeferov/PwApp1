import React from "react";
import { View, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { Body, Left, ListItem, Right, Thumbnail } from "native-base";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Foundation,
  FontAwesome,
} from "@expo/vector-icons";
const icon = require("../../../../assets/icon-ios.png");
import { t } from "../../lang";
const { width, height } = Dimensions.get("window");
import Textpopins from "../text";

export default function DrawerStyle(props) {
  return (
    <View>
      <StatusBar backgroundColor="#fff" style="dark" />
      <SafeAreaView style={styles.container}>
        <ListItem style={{ borderColor: "transparent", borderWidth: 0 }}>
          <Left>
            <Thumbnail source={icon} />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 17,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              Eyvaz Cəfərov
            </Textpopins>
          </Body>
          <Right />
        </ListItem>

        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Home")}
        >
          <Left>
            <AntDesign
              name="home"
              size={24}
              style={{ fontWeight: "bold", textAlign: "right" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.home")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Cards")}
        >
          <Left>
            <AntDesign
              name="creditcard"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                marginLeft: -Constants.statusBarHeight * 2,
                fontWeight: "bold",
              }}
            >
              {t("drawer.cards")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Bonuses")}
        >
          <Left>
            <Entypo
              name="price-ribbon"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.bonuses")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Maps")}
        >
          <Left>
            <MaterialCommunityIcons
              name="map"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.map")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("History")}
        >
          <Left>
            <FontAwesome
              name="history"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.history")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Contactus")}
        >
          <Left>
            <Foundation
              name="telephone"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.contactus")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Settings")}
        >
          <Left>
            <AntDesign
              name="setting"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2,
              }}
            >
              {t("drawer.settings")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
        <ListItem style={styles.oneElement}>
          <Left>
            <AntDesign
              name="logout"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#7c9d32"
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 16,
                color: "#7c9d32",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                marginLeft: -Constants.statusBarHeight * 2 + 7,
              }}
            >
              {t("drawer.logout")}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>
        <View style={styles.seperator} />
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
    height: 28,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "left",
    borderColor: "transparent",
    borderWidth: 0,
    backgroundColor:"transparent"
  },
  seperator: {
    width: "100%",
    marginVertical: 5,
    borderBottomColor: "#7c9d32",
    borderBottomWidth: 1.5,
  },
});
