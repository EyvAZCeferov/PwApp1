import React from "react";
import { StyleSheet, Dimensions, ScrollView, View, Text } from "react-native";
import { Thumbnail, Button } from "native-base";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
import HTMLView from "react-native-htmlview";
import { t } from "../../../functions/lang";
import { StatusBar } from "expo-status-bar";
import * as Localization from "expo-localization";
import Constants from "expo-constants";
import axios from "axios";
import { ActivityIndicator } from "react-native";
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
    }
  }

  render() {
    return (
      <View>
        <StatusBar style="dark" backgroundColor="#fff" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "#fff",
            alignItems: "center",
            alignContent: "center",
            textAlign: "center",
            marginTop: Constants.statusBarHeight,
            borderBottomColor: "#5C0082",
            borderBottomWidth: 2,
            paddingBottom: 1,
          }}
        >
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="left" size={24} color="#5C0082" />
          </Button>

          <Text
            style={styles.headerTitle}
            children={t("settings.listitems.termofuse")}
          />
          {/* <View style={{ width: "10%" }} /> */}
        </View>

        <ScrollView style={{ marginBottom: 50 }}>
          <View style={styles.justify}>
            <Thumbnail source={icon} style={styles.icon} />

            {this.state.refresh ? (
              <ActivityIndicator size="large" color="#5C0082" />
            ) : (
              <HTMLView
                // value={this.langConvert(this.state.datas)}
                value={this.state.datas.az_description}
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
  justify: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 20,
  },
  icon: {
    marginVertical: 40,
    width: width / 4,
    height: height / 6,
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
  },
});
