import * as React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Keyboard,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  Button,
  Input,
  Spinner,
  Textarea,
  Form,
  Footer,
  FooterTab,
} from "native-base";
import HeaderDrawer from "./components/header";
import { Col, Grid, Row } from "react-native-easy-grid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
import { MaterialCommunityIcons, Entypo, Feather } from "@expo/vector-icons";
import firebase from "../../../functions/firebase/firebaseConfig";
import { makeid } from "../../../functions/standart/helper";
import Constants from "expo-constants";
export default class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: null,
      message: null,
      isSender: false,
    };
  }

  sendMessage = () => {
    firebase.database().goOnline();
    Keyboard.dismiss();
    this.setState({ isSender: true });
    if (this.state.subject === null && this.state.message === null) {
      this.dropDownAlertRef.alertWithType("info", t("fillInput"));
      this.setState({ isSender: false });
    } else {
      var user = firebase.auth().currentUser;
      var id = this.makeid(16);
      firebase
        .database()
        .ref("contactus/" + id)
        .set({
          userId: user.uid,
          id: id,
          userEmail: user.email,
          subject: this.state.subject,
          message: this.state.message,
        })
        .then(
          () => {
            this.setState({ isSender: false });
            this.setState({ subject: null });
            this.setState({ message: null });
            this.dropDownAlertRef.alertWithType("success", t("sendMessage"));
          },
          (err) => {
            this.setState({ isSender: false });
            this.dropDownAlertRef.alertWithType("error", err.message);
          }
        );
    }
  };

  render() {
    return (
      <View style={{ flex: 1, position: "relative", backgroundColor: "#fff" }}>
        <HeaderDrawer {...this.props} name={t("drawer.contactus")} />
        <View
          style={{
            width: "100%",
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
            onPress={() => Linking.openURL("mailto:payandwin.az@gmail.com")}
          >
            <MaterialCommunityIcons name="gmail" size={27} color="#6d7587" />
            <Text style={styles.text} children="G-Mail" />
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
            <Text style={styles.text} children="Fb Messenger" />
          </TouchableOpacity>
        </View>

        <Form style={styles.form}>
          {this.state.isSender === true ? (
            <Spinner color="#7c9d32" size={36} />
          ) : (
            <View style={styles.form}>
              <View style={styles.itemStyle}>
                <Input
                  style={styles.inputstyle}
                  placeholder={t("form.labels.subject")}
                  placeholderTextColor="rgba(0,0,0,.5)"
                  autoCorrect={false}
                  autoCapitalize={false}
                  keyboardAppearance="dark"
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
                  keyboardAppearance="default"
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
              <View
                style={[
                  styles.itemStyle,
                  { marginTop: Constants.statusBarHeight },
                ]}
              >
                <TouchableOpacity
                  style={{
                    borderColor: "#7c9d32",
                    borderWidth: 2,
                    paddingVertical: 15,
                  }}
                  onPress={() => this.sendMessage()}
                >
                  <Text
                    style={{
                      color: "#7c9d32",
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

        <Footer style={{
             marginTop:Constants.statusBarHeight*2.07,
             zIndex:9999,
             backgroundColor:"#fff",
             borderColor:"#7c9d32",
             borderTopWidth:2,
            }}>
          <FooterTab style={styles.footerTab}>
            <Button
              transparent
              onPress={() => Linking.openURL("https://payandwin.az")}
            >
              <Entypo name="link" size={22} color="#7c9d32" />
            </Button>
            <Button
              transparent
              onPress={() => Linking.openURL("http://youtube.com")}
            >
              <Feather name="youtube" size={22} color="#7c9d32" />
            </Button>
            <Button
              transparent
              onPress={() =>
                Linking.openURL("https://www.facebook.com/PayandWin1/")
              }
            >
              <Feather name="facebook" size={22} color="#7c9d32" />
            </Button>
            <Button
              transparent
              onPress={() =>
                Linking.openURL("https://www.instagram.com/payandwin.az/")
              }
            >
              <Feather name="instagram" size={24} color="#7c9d32" />
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#6d7587",
    textAlign: "center",
  },
  form: {
    margin: 0,
    marginTop: Constants.statusBarHeight,
    width: width,
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
    backgroundColor: "#fff",
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
    maxHeight: 90,
    minHeight: 80,
    paddingTop: 10,
  },
  footerTab: {
    backgroundColor: "#fff",
  },
});
