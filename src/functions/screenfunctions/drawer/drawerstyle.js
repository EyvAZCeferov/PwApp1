import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Body, Left, ListItem, Right, Thumbnail } from "native-base";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Foundation,
  Ionicons,
  FontAwesome,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { ProgramLockContext } from "../../../functions/Hooks/Authentication/Lock/ProgramLockContext";
import { get_image } from "../../../functions/standart/helper";
const icon = require("../../../../assets/icon-ios.png");
import { t } from "../../lang";

const { width, height } = Dimensions.get("window");
import Textpopins from "../text";
import axios from "axios";

export default function DrawerStyle(props) {
  const contextType = React.useContext(ProgramLockContext);

  function navigationreset() {
    const { program, setProgram } = contextType;
    setProgram(false);
  }

  return (
    <View>
      <StatusBar backgroundColor="#fff" style="dark" />
      <SafeAreaView style={styles.container}>
        <ListItem style={{ borderColor: "transparent", borderWidth: 0 }}>
          <Left>
            <Thumbnail
              source={
                props.usdata
                  ? props.usdata.image
                    ? get_image(props.usdata.image)
                    : icon
                  : icon
              }
              style={{
                height: 80,
                width: 80,
              }}
            />
          </Left>
          <Body>
            <Textpopins
              style={{
                fontSize: 17,
                color: "#5C0082",
                fontFamily: "Poppins_400Regular",
                fontWeight: "bold",
                textAlign: "left",
                width: width,
                marginLeft: -Constants.statusBarHeight,
              }}
            >
              {props.usdata ? props.usdata.name : null}
            </Textpopins>
          </Body>
          <Right />
        </ListItem>

        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Home")}
        >
          <Left>
            <AntDesign
              name="home"
              size={24}
              style={{ fontWeight: "bold", textAlign: "right" }}
              color="#5C0082"
            />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.home")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Cards")}
        >
          <Left>
            <AntDesign
              name="creditcard"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#5C0082"
            />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.cards")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Bonuses")}
        >
          <Left>
            <Ionicons name="pricetag-outline" size={24} color="#5C0082" />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.bonuses")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Maps")}
        >
          <Left>
            <Feather name="map-pin" size={24} color="#5C0082" />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.map")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("History")}
        >
          <Left>
            <MaterialIcons name="history" size={24} color="#5C0082" />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.history")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Contactus")}
        >
          <Left>
            <AntDesign name="contacts" size={24} color="#5C0082" />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>
              {t("drawer.contactus")}
            </Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={() => props.navigation.navigate("Settings")}
        >
          <Left>
            <AntDesign
              name="setting"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#5C0082"
            />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.settings")}</Textpopins>
          </Body>
          <Right />
        </TouchableOpacity>
        <View style={styles.seperator} />
        <TouchableOpacity
          style={styles.oneElement}
          onPress={async () => {
            await axios.post("/auth/logout").then(async (e) => {
              AsyncStorage.removeItem("token");
              navigationreset();
            });
          }}
        >
          <Left>
            <AntDesign
              name="logout"
              size={24}
              style={{ fontWeight: "bold" }}
              color="#5C0082"
            />
          </Left>
          <Body>
            <Textpopins style={styles.texts}>{t("drawer.logout")}</Textpopins>
          </Body>
          <Right />
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
    borderBottomColor: "#5C0082",
    borderBottomWidth: 1.5,
  },
  texts: {
    fontSize: 16,
    color: "#5C0082",
    fontFamily: "Poppins_400Regular",
    fontWeight: "bold",
    textAlign: "left",
    width: width / 2,
    height: 35,
    paddingTop: 6,
    paddingLeft: Constants.statusBarHeight,
  },
});
