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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const succesImage = require("../../../../assets/images/Alert/tick.png");

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      password: null,
    };
  }

  login = async () => {
    Keyboard.dismiss();
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("haveFinger");
    await AsyncStorage.removeItem("localAuthPass");
    if (this.state.phone !== null && this.state.password !== null) {
      var data = new FormData();
      data.append("phone", this.state.phone);
      data.append("password", this.state.password);
      await axios
        .post("auth/login", data)
        .then((res) => {
          this.dropDownAlertRef.alertWithType("info", res.data);
          this.props.navigation.navigate("MobileVerify", {
            phone: this.state.phone,
            password: this.state.password,
          });
        })
        .catch((error) => error);
    } else {
      this.dropDownAlertRef.alertWithType("error", t("actions.noResult"));
    }
  };

  navigationreset() {
    return this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "Home" },
          {
            name: "Home",
          },
        ],
      })
    );
  }

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
          <Animatable.Image
            animation="fadeIn"
            duration={1000}
            source={icon}
            useNativeDriver={true}
            resizeMode="stretch"
            style={styles.logo}
          />
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
            {t("form.buttons.login")}
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
            <Item style={styles.item} success>
              <MaterialCommunityIcons
                style={{ paddingRight: 5 }}
                name="form-textbox-password"
                size={24}
                color="black"
              />
              <Input
                placeholder={t("form.labels.password")}
                onChangeText={(text) => this.setState({ password: text })}
                style={styles.input}
                onSubmitEditing={() => Keyboard.dismiss}
                secureTextEntry={true}
              />
            </Item>
            <Item style={styles.forget}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ForgotPass")}
              >
                <Textpopins>{t("loginregister.forgetpass.title")} ?</Textpopins>
              </TouchableOpacity>
            </Item>
            <Item
              style={[
                styles.item,
                {
                  justifyContent: "space-between",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.login}
                onPress={() => this.props.navigation.navigate("Register")}
              >
                <Textpopins style={styles.title}>
                  {t("form.buttons.register")}
                </Textpopins>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.login}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#5C0082", "#C90052"]}
                  style={styles.login}
                >
                  <Textpopins style={[styles.title, { color: "#fff" }]}>
                    {t("form.buttons.login")} !
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
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 0.6,
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
});
