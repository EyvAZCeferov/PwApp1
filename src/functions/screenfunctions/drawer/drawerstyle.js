import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Thumbnail } from "native-base";
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

export default function DrawerStyle(props) {
  return (
    <View>
      <StatusBar backgroundColor="#fff" style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={styles.profileSection}>
          <Thumbnail style={{ width: 60, height: 60 }} source={icon} />
          <Text style={{ fontSize: 16, color: "#7c9d32" }}>Eyvaz Cəfərov</Text>
        </View>

        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Home")}
        >
          <AntDesign
            name="home"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.home")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Cards")}
        >
          <AntDesign
            name="creditcard"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.cards")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Bonuses")}
        >
          <Entypo
            name="price-ribbon"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.bonuses")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Account")}
        >
          <MaterialCommunityIcons
            name="account"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.accounts")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Maps")}
        >
          <MaterialCommunityIcons
            name="map"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.map")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("History")}
        >
          <FontAwesome
            name="history"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.history")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Contactus")}
        >
          <Foundation
            name="telephone"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.contactus")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Settings")}
        >
          <AntDesign
            name="setting"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.settings")}
          </Text>
          <View />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity style={styles.oneElement}>
          <AntDesign
            name="logout"
            size={24}
            style={{ fontWeight: "bold" }}
            color="#7c9d32"
          />
          <Text style={{ fontSize: 16, color: "#7c9d32", fontWeight: "bold" }}>
            {t("drawer.logout")}
          </Text>
          <View />
        </TouchableOpacity>
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
  profileSection: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 15,
  },
  oneElement: {
    width: "100%",
    height: 28,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 19,
  },
  seperator: {
    width: "100%",
    marginVertical: 5,
    borderBottomColor: "#7c9d32",
    borderBottomWidth: 1.5,
  },
});
