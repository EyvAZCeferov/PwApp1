import * as React from "react";
import { StyleSheet, Dimensions, View, SafeAreaView } from "react-native";
import { Button } from "native-base";
import { Snackbar } from 'react-native-paper';

import * as Animatable from "react-native-animatable";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("screen");
import { StatusBar } from "expo-status-bar";
import { t } from "../../../functions/lang";

var reqems = "";

const icon = require("../../../../assets/icon-ios.png");
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from "../../../functions/screenfunctions/text";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { ProgramLockContext } from "../../../functions/Hooks/Authentication/Lock/ProgramLockContext";
import * as LocalAuthentication from "expo-local-authentication";
import NumberButtons from "./Components/NumberButtons";
import Codefield from "./Components/ProgramLock/CodeField";
import axios from "axios";

export default class Lock extends React.Component {
  static contextType = ProgramLockContext;

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      hasFingerPrintHardware: false,
      pass: "",
      refresh: true,
      visible: false,
    };
  }

  async refreshToken() {
    await axios.post("auth/refresh").then(async (e) => {
      await AsyncStorage.setItem("token", e.data.access_token);
    });
  }

  async getSoragePerm() {
    await AsyncStorage.getItem("haveFinger").then((a) => {
      if (a != null) {
        this.hasHardware();
      }
    });
  }

  async hasHardware() {
    let permission = await LocalAuthentication.hasHardwareAsync();
    if (permission) {
      let type = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let isFinger = type.includes(1);
      if (isFinger) {
        this.callFinger();
        this.setState({
          hasFingerPrintHardware: isFinger,
        });
      }
    }
  }

  componentDidMount() {
    this.refreshToken();
    this.getSoragePerm();
    this.getInfo();
  }

  async getInfo() {
    await axios.get("auth/me").then((e) => {
      this.setState({
        userData: e.data,
      });
    });
  }

  completed() {
    const { program, setProgram } = this.context;
    this.setState({visible:true})
    setProgram(true);
  }

  async callFinger() {
    let enroll = await LocalAuthentication.isEnrolledAsync();
    if (enroll) {
      let authenticate = await LocalAuthentication.authenticateAsync({
        promptMessage: t("loginregister.programlock.useFingerPrint"),
        cancelLabel: t("actions.cancel"),
        fallbackLabel: t("form.labels.password"),
        disableDeviceFallback: true,
      });
      if (authenticate != null) {
        if (authenticate.success) {
          this.dropDownAlertRef.alertWithType(
            "success",
            t("form.validation.loginregister.login.success")
          );
          this.completed();
        }
      }
    }
  }

  fingerPrint() {
    this.callFinger();
  }

  async changeVal(val) {
    reqems = reqems + val;
    if (reqems.length > 4) {
      //
    } else {
      this.setState({ pass: reqems });
    }
  }

  clearVal() {
    reqems = "";
    this.setState({ pass: "" });
  }

  renderContent() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          // marginBottom: Constants.statusBarHeight * 2,
        }}
      >
        <Codefield
          completed={() => this.completed()}
          value={this.state.pass}
          {...this.props}
        />
        <NumberButtons
          clearVal={() => this.clearVal()}
          changeVal={(e) => this.changeVal(e)}
          {...this.props}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#EBECF0" style="dark" />
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'Undo',
          }}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
        <View style={styles.header}>
          <Animatable.Image
            animation="fadeIn"
            duration={1000}
            source={
              this.state.userData
                ? this.state.userData.image != null
                  ? { uri: this.state.userData.image }
                  : icon
                : icon
            }
            useNativeDriver={true}
            resizeMode="stretch"
            style={[styles.logo]}
          />
          <Animatable.Text
            animation="fadeIn"
            duration={1000}
            delay={500}
            useNativeDriver={true}
            style={{
              textAlign: "center",
              color: "#96CA00",
              fontSize: 20,
              marginTop: Constants.statusBarHeight / 4,
            }}
          >
            {this.state.userData
              ? this.state.userData.name
              : t("loginregister.programlock.namesurname")}
          </Animatable.Text>
        </View>
        <View style={styles.content}>{this.renderContent()}</View>
        <View style={[styles.footer, styles.center]}>
          {this.state.hasFingerPrintHardware ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                transparent
                style={[styles.footerButton, { marginRight: 5 }]}
                onPress={() => this.props.navigation.navigate("ForgotPass")}
              >
                <Entypo name="lock" size={24} color="#96CA00" />
                <Textpopins
                  style={{ color: "#96CA00", fontSize: 15, marginTop: 25 }}
                >
                  {t("loginregister.forgetpass.title")}
                </Textpopins>
              </Button>
              <Button
                style={[styles.footerButton, { marginLeft: 5 }]}
                onPress={() => this.callFinger()}
                transparent
              >
                <FontAwesome5 name="fingerprint" size={24} color="#96CA00" />
                <Textpopins
                  style={{
                    color: "#96CA00",
                    fontSize: 15,
                    marginTop: 25,
                  }}
                >
                  {t("loginregister.programlock.useFingerPrint")}
                </Textpopins>
              </Button>
            </View>
          ) : (
            <Button
              transparent
              full
              style={[styles.footerButton, styles.center]}
              onPress={() => this.props.navigation.navigate("ForgotPass")}
            >
              <Entypo name="lock" size={24} color="#96CA00" />
              <Textpopins
                style={{ color: "#96CA00", fontSize: 15, marginTop: 5 }}
              >
                {t("loginregister.forgetpass.title")}
              </Textpopins>
            </Button>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF0",
  },
  header: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 0.6,
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
    borderBottomLeftRadius: Constants.statusBarHeight * 1.2,
    borderBottomRightRadius: Constants.statusBarHeight * 1.2,
    backgroundColor: "#EBECF0",
  },
  footer: {
    flex: 0.1,
    backgroundColor: "#EBECF0",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: Constants.statusBarHeight,
    height: width / 3,
    width: width / 3,
    backgroundColor: "transparent",
    borderRadius: width,
  },
  footerButton: {
    flexDirection: "column",
    justifyContent: "space-around",
    zIndex: 9999,
  },
});
