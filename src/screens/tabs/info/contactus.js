import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Keyboard,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Input, Spinner, Textarea, Form, FooterTab } from "native-base";
import HeaderDrawer from "./components/header";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
import { MaterialCommunityIcons, Entypo, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";
import FormData from "form-data";
import DropdownAlert from "react-native-dropdownalert";
const succesImage = require("../../../../assets/images/Alert/tick.png");

export default class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: null,
      message: null,
      isSender: false,
      setting: null,
    };
  }

  sendMessage = async () => {
    Keyboard.dismiss();
    this.setState({ isSender: true });
    var data = new FormData();
    data.append("subject", this.state.subject);
    data.append("message", this.state.message);
    await axios.post("actions/contact", data).then((e) => {
      this.dropDownAlertRef.alertWithType("success", t("actions.sended"));
      this.setState({
        subject: null,
        message: null,
        isSender: false,
      });
    });
  };

  async getSetting() {
    try {
      await axios.get("paygo/settings").then((e) => {
        this.setState({ setting: e.data });
      });
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    this.getSetting();
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderDrawer {...this.props} name={t("drawer.contactus")} />
        <DropdownAlert
          ref={(ref) => (this.dropDownAlertRef = ref)}
          useNativeDriver={true}
          closeInterval={1000}
          updateStatusBar={true}
          tapToCloseEnabled={true}
          showCancel={true}
          elevation={5}
          isInteraction={false}
          successImageSrc={succesImage}
        />

        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              onPress={() =>
                Linking.openURL("mailto:" + this.state.setting.social.mail)
              }
            >
              <MaterialCommunityIcons name="gmail" size={27} color="#6d7587" />
              <Textpopins style={styles.text} children="G-Mail" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <MaterialCommunityIcons
                name="facebook-messenger"
                size={27}
                color="#6d7587"
              />
              <Textpopins style={styles.text} children="Fb Messenger" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Form style={styles.form}>
            {this.state.isSender === true ? (
              <Spinner color="#5C0082" size={36} />
            ) : (
              <View style={styles.form}>
                <View style={styles.itemStyle}>
                  <Input
                    style={styles.inputstyle}
                    placeholder={t("form.labels.subject")}
                    placeholderTextColor="rgba(0,0,0,.5)"
                    autoCorrect={false}
                    autoCapitalize={false}
                    keyboardType="default"
                    autoFocus={false}
                    onChangeText={(val) => {
                      this.setState({ subject: val });
                    }}
                  />
                </View>
                <View style={styles.itemStyle}>
                  <Textarea
                    focusable={true}
                    keyboardType="normal"
                    style={[styles.inputstyle, styles.textArea]}
                    placeholder={t("form.labels.content")}
                    placeholderTextColor="rgba(0,0,0,.5)"
                    autoCorrect={false}
                    autoCapitalize={false}
                    autoFocus={false}
                    onChangeText={(val) => {
                      this.setState({ message: val });
                    }}
                  />
                </View>
                <View style={styles.itemStyle}>
                  <TouchableOpacity
                    style={{
                      borderColor: "#5C0082",
                      borderWidth: 2,
                      paddingVertical: 15,
                      marginTop: Constants.statusBarHeight,
                    }}
                    onPress={() => this.sendMessage()}
                  >
                    <Textpopins
                      style={{
                        color: "#5C0082",
                        textAlign: "center",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                      children={t("actions.send")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Form>
        </View>

        <View style={styles.footer}>
          <View
            style={{
              marginTop: Constants.statusBarHeight * 1,
              backgroundColor: "transparent",
              borderColor: "#5C0082",
              borderTopWidth: 2,
            }}
          >
            <FooterTab style={styles.footerTab}>
              <Button
                transparent
                style={{
                  zIndex: 999,
                }}
                onPress={() => Linking.openURL(this.state.setting.site_url)}
              >
                <Entypo name="link" size={22} color="#5C0082" />
              </Button>
              <Button
                style={{
                  zIndex: 999,
                }}
                transparent
                onPress={() => Linking.openURL(this.state.setting.social.yt)}
              >
                <Feather name="youtube" size={22} color="#5C0082" />
              </Button>
              <Button
                style={{
                  zIndex: 999,
                }}
                transparent
                onPress={() => Linking.openURL(this.state.setting.social.fb)}
              >
                <Feather name="facebook" size={22} color="#5C0082" />
              </Button>
              <Button
                style={{
                  zIndex: 999,
                }}
                transparent
                onPress={() => Linking.openURL(this.state.setting.social.ig)}
              >
                <Feather name="instagram" size={24} color="#5C0082" />
              </Button>
            </FooterTab>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.2,
  },
  content: {
    flex: 0.6,
  },
  footer: {
    flex: 0.2,
  },
  text: {
    fontSize: 18,
    color: "#6d7587",
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  itemStyle: {
    width: width - 50,
    height: 60,
    marginVertical: 10,
  },
  inputstyle: {
    height: 50,
    width: "100%",
    lineHeight: 40,
    borderColor: "#fff",
    borderWidth: 3,
    paddingLeft: 10,
    color: "#6d7587",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,.4)",
    borderWidth: 2,
  },
  textArea: {
    maxHeight: 100,
    minHeight: 90,
    paddingTop: 10,
    marginBottom: Constants.statusBarHeight,
  },
  footerTab: {
    backgroundColor: "transparent",
    marginVertical: Constants.statusBarHeight/2,
    marginTop: Constants.statusBarHeight,
  },
});
