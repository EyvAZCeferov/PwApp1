import React from "react";
import { StyleSheet, Dimensions, ScrollView, View, Text } from "react-native";
import { Thumbnail, Header, Button } from "native-base";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
import firebase from "../../../functions/firebase/firebaseConfig";
import HTMLView from "react-native-htmlview";
import { t } from "../../../functions/lang";
import { StatusBar } from "expo-status-bar";
import * as Localization from "expo-localization";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";

export default class Termofuse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    firebase
      .database()
      .ref("termOfUse/1")
      .on("value", (data) => {
        this.setState({ datas: data.toJSON() });
      });
  }

  langConvert(e) {
    if (Localization.locale == "en" || Localization.locale === "en") {
      return e.en_text;
    } else if (Localization.locale == "ru" || Localization.locale === "ru") {
      return e.ru_text;
    } else if (Localization.locale == "az" || Localization.locale === "az") {
      return e.az_text;
    }
  }

  render() {
    return (
      <View>
        <StatusBar style="dark" backgroundColor="#fff" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            alignItems: "center",
            alignContent: "center",
            textAlign: "center",
            marginTop: Constants.statusBarHeight,
            borderBottomColor: "#7c9d32",
            borderBottomWidth: 2,
            paddingBottom: 1,
          }}
        >
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="left" size={24} color="#7c9d32" />
          </Button>

          <Text
            style={styles.headerTitle}
            children={t("settings.listitems.termofuse")}
          />
          <View />
        </View>

        <ScrollView style={{ marginBottom: 50 }}>
          <View style={styles.justify}>
            <Thumbnail
              source={{ uri: this.state.datas.icon }}
              style={styles.icon}
            />
            <Textpopins
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#010101",
                width: width,
                height: 20,
                textAlign: "center",
                marginBottom: 10,
              }}
              children="Pay And Way"
            />
            <HTMLView
              value={this.langConvert(this.state.datas)}
              stylesheet={styles.textColor}
              addLineBreaks={true}
            />
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
    color: "#7c9d32",
    fontWeight: "bold",
    fontSize: 19,
    marginLeft: Constants.statusBarHeight,
  },
  textColor: {
    color: "#6d7587",
    fontFamily: "Poppins_400Regular",
  },
});