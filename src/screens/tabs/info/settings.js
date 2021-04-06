import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Picker,
} from "react-native";
import { Button, Left, Right, ListItem, List, Body } from "native-base";
import {
  Entypo,
  Feather,
  MaterialCommunityIcons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Restart } from "fiction-expo-restart";

import HeaderDrawer from "./components/header";
import * as Localization from "expo-localization";

const { width, height } = Dimensions.get("window");
import { setLang, t } from "../../../functions/lang";
import AsyncStorage from "@react-native-community/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Localization.locale,
      haveFinger: null,
      refresh: true,
      hasFingerPrintHardware: false,
    };
  }

  onValueChange(sel) {
    console.log(sel);
    setLang(sel);
    this.setState({ selected: sel });
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "Home" },
          {
            name: "Settings",
          },
        ],
      })
    );
    Restart();
  }

  componentDidMount() {
    this.getFingStat();
    this.hasHardware();
  }

  async hasHardware() {
    let permission = await LocalAuthentication.hasHardwareAsync();
    if (permission) {
      let type = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let isFinger = type.includes(1);
      if (isFinger) {
        this.setState({
          hasFingerPrintHardware: isFinger,
        });
      }
    }
  }

  async getFingStat() {
    await AsyncStorage.getItem("haveFinger").then((a) => {
      this.setState({ haveFinger: a, refresh: false });
    });
    this.renderContent();
  }

  deleteFinger() {
    var that = this;
    Alert.alert(
      t("actions.wantdelete"),
      t("actions.notrecovered"),
      [
        {
          text: t("actions.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("actions.delete"),
          onPress: () => doAnything(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );

    async function doAnything() {
      await AsyncStorage.removeItem("haveFinger");
      await AsyncStorage.getItem("haveFinger").then((a) => {
        that.getFingStat();
      });
    }
  }

  addFinger() {
    var that = this;
    Alert.alert(
      t("settings.addfinger"),
      t("loginregister.programlock.useFingerPrint"),
      [
        {
          text: t("actions.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("settings.addfinger"),
          onPress: () =>
            that.props.navigation.navigate("SetFinger", {
              prevPage: "Settings",
            }),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  renderFingerStat() {
    if (this.state.haveFinger != null) {
      return (
        <Right>
          <Button
            danger
            style={[styles.center, { width: width / 8 }]}
            onPress={() => this.deleteFinger()}
          >
            <Feather name="trash" color="#fff" size={22} />
          </Button>
        </Right>
      );
    } else {
      return (
        <Right>
          <Button
            success
            style={[styles.center, { width: width / 8 }]}
            onPress={() => this.addFinger()}
          >
            <AntDesign name="plus" color="#fff" size={22} />
          </Button>
        </Right>
      );
    }
  }

  renderContent() {
    if (this.state.refresh) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" animating={true} color="#7c9d32" />
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <HeaderDrawer {...this.props} name={t("drawer.settings")} />
          <View style={styles.content}>
            <List style={styles.lists}>
              <ListItem style={styles.listitemDivider} itemDivider>
                <Text
                  style={styles.listitemDividerText}
                  children={t("settings.listitems.general")}
                />
              </ListItem>
              <ListItem style={styles.listitemDivider} itemDivider>
                <Entypo name="language" size={24} color="#6d7587" />
                <Picker
                  enabled
                  mode="dropdown"
                  selectedValue={this.state.selected}
                  onValueChange={(val) => this.onValueChange(val)}
                  style={{ width: width / 1.5, zIndex: 9999 }}
                >
                  <Picker.Item value="az" label="       Azərbaycan" />
                  <Picker.Item value="ru" label="       Rus" />
                  <Picker.Item value="en" label="       İngilis" />
                </Picker>
              </ListItem>
              <ListItem style={styles.listitemDivider} itemDivider>
                <Text
                  style={styles.listitemDividerText}
                  children={t("settings.listitems.security")}
                />
              </ListItem>
              <ListItem
                style={[styles.listitem, styles.active]}
                icon
                onPress={() => this.props.navigation.navigate("SetPass")}
              >
                <Left style={styles.left}>
                  <MaterialCommunityIcons
                    name="form-textbox-password"
                    size={24}
                    color="#6d7587"
                  />
                </Left>
                <Body style={styles.body}>
                  <Text
                    style={styles.text}
                    children={t("settings.listitems.changeloginpass")}
                  />
                </Body>
              </ListItem>
              {this.state.hasFingerPrintHardware ? (
                <ListItem style={styles.listitem} icon>
                  <Left style={styles.left}>
                    <Entypo name="fingerprint" size={24} color="#6d7587" />
                  </Left>
                  <Body style={styles.body}>
                    <Text
                      style={styles.text}
                      children={t("settings.listitems.fingerprint")}
                    />
                  </Body>
                  {this.renderFingerStat()}
                </ListItem>
              ) : null}
              <ListItem style={styles.listitemDivider} itemDivider last>
                <Text
                  style={styles.listitemDividerText}
                  children={t("settings.listitems.aboutapplication")}
                />
              </ListItem>
              <ListItem
                style={styles.listitem}
                icon
                onPress={() => this.props.navigation.navigate("Termofuse")}
              >
                <Left style={styles.left}>
                  <Foundation name="page-doc" size={24} color="#6d7587" />
                </Left>
                <Body style={styles.body}>
                  <Text
                    style={styles.text}
                    children={t("settings.listitems.termofuse")}
                  />
                </Body>
              </ListItem>
              <ListItem
                style={styles.listitem}
                icon
                onPress={() => this.props.navigation.navigate("Account")}
              >
                <Left style={styles.left}>
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={24}
                    color="#6d7587"
                  />
                </Left>
                <Body style={styles.body}>
                  <Text
                    style={styles.text}
                    children={t("settings.listitems.accounts")}
                  />
                </Body>
              </ListItem>
              <ListItem style={styles.listitemDivider} itemDivider last>
                <Text
                  style={styles.listitemDividerText}
                  children={t("settings.listitems.programversion")}
                />
              </ListItem>
              <ListItem style={styles.listitem} icon>
                <Left style={styles.left}>
                  <MaterialCommunityIcons
                    name="cloud-print-outline"
                    size={24}
                    color="#6d7587"
                  />
                </Left>
                <Body style={styles.body}>
                  <Text
                    style={styles.text}
                    children={t("settings.listitems.programversion") + " 1.0.0"}
                  />
                </Body>
              </ListItem>
            </List>
          </View>
        </View>
      );
    }
  }

  render() {
    return <View style={{ flex: 1 }}>{this.renderContent()}</View>;
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    width: width,
    height: height,
  },
  center: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  ptop: {
    marginTop: 20,
  },
  lists: {
    width: width,
    height: height,
    marginLeft: 0,
    backgroundColor: "#fff",
  },
  listitem: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 0,
    width: width,
    height: 50,
    marginLeft: 0,
  },
  listitemDivider: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 0,
    width: width,
    height: 40,
    marginLeft: 0,
  },
  listitemDividerText: {
    fontSize: 14,
    color: "#6d7587",
    fontWeight: "500",
  },
  left: {
    paddingHorizontal: 15,
    marginRight: 15,
  },
  pickerIcon: {
    position: "absolute",
    right: -150,
  },
  body: {
    borderColor: "transparent",
  },
  text: {
    fontSize: 18,
    color: "#7c9d32",
    fontWeight: "600",
  },
  active: {
    backgroundColor: "#fff",
  },
});
