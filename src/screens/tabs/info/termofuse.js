import React from "react";
import { StyleSheet, Dimensions, ScrollView, View, Text } from "react-native";
import { Thumbnail, Button } from "native-base";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
import HTMLView from "react-native-htmlview";
import { t } from "../../../functions/lang";
import { StatusBar } from "expo-status-bar";
import * as Localization from "expo-localization";
import HeaderDrawer from "./components/header";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import Constants from "expo-constants";
const icon = require("../../../../assets/icon-ios.png");

export default class Termofuse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: null,
      refresh: true,
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    this.setState({
      refresh: true,
    });
    axios.get("actions/termofuse").then((e) => {
      console.log(e.data);
      this.setState({
        datas: e.data,
        refresh: false,
      });
    });
  }

  langConvert(e) {
    if (Localization.locale == "en" || Localization.locale === "en") {
      return e.en_description;
    } else if (Localization.locale == "ru" || Localization.locale === "ru") {
      return e.ru_description;
    } else if (Localization.locale == "az" || Localization.locale === "az") {
      return e.az_description;
    } else {
      return e.az_description;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <HeaderDrawer
          {...this.props}
          name={t("settings.listitems.termofuse")}
        />
        <ScrollView style={{ marginBottom: Constants.statusBarHeight / 4 }}>
          <View style={styles.justify}>
            <Thumbnail source={icon} style={styles.icon} />
            {this.state.refresh ? (
              <ActivityIndicator size="large" color="#5C0082" />
            ) : (
              <HTMLView
                value={this.langConvert(this.state.datas)}
                stylesheet={styles.textColor}
                addLineBreaks={true}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  justify: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: Constants.statusBarHeight / 2,
  },
  icon: {
    width: width / 2,
    height: height / 3,
  },
  headerTitle: {
    color: "#5C0082",
    fontWeight: "bold",
    fontSize: 19,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textColor: {
    color: "#6d7587",
    fontFamily: "Poppins_400Regular",
    fontSize: 25,
  },
});
