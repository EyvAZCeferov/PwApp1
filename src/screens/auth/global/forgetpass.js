import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Form, Input, Item } from "native-base";

import * as Animatable from "react-native-animatable";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("screen");
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "../../../functions/lang";

const icon = require("../../../../assets/icon-white-no-bg.png");
import AsyncStorage from "@react-native-community/async-storage";
import Textpopins from "../../../functions/screenfunctions/text";
import DropdownAlert from "react-native-dropdownalert";
import auth from "../../../functions/actions/auth";
import { CommonActions } from "@react-navigation/native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const succesImage = require("../../../../assets/images/Alert/tick.png");

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
    };
  }

  forget = async () => {
    await AsyncStorage.removeItem("haveFinger");
    await AsyncStorage.removeItem("localAuthPass");
    await AsyncStorage.removeItem("token");
    if (this.state.phone !== null) {
      var data = new FormData();
      data.append("phone", this.state.phone);
      await axios
        .post("auth/forget", data)
        .then((e) => {
          this.dropDownAlertRef.alertWithType("info", res.data);
          if (res.data == "Success") {
            this.props.navigation.navigate("MobileVerify", {
              phone: this.state.phone,
              prevpage: "forget",
            });
          }
        })
        .catch((error) => error);
    } else {
      this.dropDownAlertRef.alertWithType("error", t("actions.noResult"));
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
        <StatusBar backgroundColor="#5C0082" style="light" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => this.props.navigation.pop()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Animatable.Image
            animation="fadeIn"
            duration={1000}
            source={icon}
            useNativeDriver={true}
            resizeMode="stretch"
            style={styles.logo}
          />
          <View />
        </View>

        <Animatable.View
          style={styles.content}
          useNativeDriver={true}
          animation="slideInUp"
          duration={1000}
        >
          <Textpopins
            style={[
              styles.title,
              { marginVertical: Constants.statusBarHeight },
            ]}
          >
            {t("loginregister.forgetpass.title")}
          </Textpopins>
          <Form>
            <Item style={styles.item} success>
              <Feather
                name="phone"
                size={24}
                color="black"
                style={{ paddingRight: 5 }}
              />
              <Input
                onChangeText={(text) => this.setState({ phone: text })}
                style={styles.input}
                onSubmitEditing={() => Keyboard.dismiss}
                placeholder={"994xxxxxxxxx"}
                keyboardType={"phone-pad"}
              />
            </Item>

            <Item
              style={[
                styles.item,
                {
                  marginTop: Constants.statusBarHeight,
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                },
              ]}
            >
              <TouchableOpacity onPress={this.forget}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#5C0082", "#C90052"]}
                  style={styles.login}
                >
                  <Textpopins style={[styles.title, { color: "#fff" }]}>
                    {t("form.buttons.submit")} !
                  </Textpopins>
                </LinearGradient>
              </TouchableOpacity>
            </Item>
          </Form>
        </Animatable.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C0082",
  },
  header: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 0.4,
    borderTopLeftRadius: Constants.statusBarHeight,
    borderTopRightRadius: Constants.statusBarHeight,
    backgroundColor: "#fff",
    paddingVertical: Constants.statusBarHeight,
    paddingHorizontal: Constants.statusBarHeight,
  },
  logo: {
    width: "50%",
    height: width / 4,
    backgroundColor: "transparent",
  },
  title: {
    color: "#5C0082",
    fontWeight: "bold",
    fontSize: 20,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "transparent",
    marginLeft: 0,
  },
  forget: {
    paddingTop: Constants.statusBarHeight,
    borderColor: "transparent",
  },
  input: {
    borderBottomColor: "#5C0082",
    borderBottomWidth: 2,
  },
  login: {
    paddingHorizontal: Constants.statusBarHeight,
    borderColor: "#5C0082",
    paddingVertical: 5,
    marginVertical: 5,
    borderWidth: 2,
    borderRadius: Constants.statusBarHeight * 2,
  },
  back: {
    paddingHorizontal: Constants.statusBarHeight / 2,
    backgroundColor: "transparent",
    paddingVertical: Constants.statusBarHeight / 3,
    borderRadius: Constants.statusBarHeight,
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 0,
  },
});
