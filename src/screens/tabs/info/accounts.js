import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Thumbnail, Content, Form, Input, Button, Item } from "native-base";
import HeaderDrawer from "./components/header";
import customStyle from "../../../../assets/Theme";
import { t } from "../../../functions/lang";
import firebase from "../../../functions/firebase/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import DropdownAlert from "react-native-dropdownalert";
import Textpopins from "./../../../functions/screenfunctions/text";
import axios from "axios";
import FormData from "form-data";
const { width, height } = Dimensions.get("window");
const icon = require("../../../../assets/icon-ios.png");

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isReady: false,
      form: {
        phone: null,
        email: null,
      },
    };
  }

  componentDidMount() {
    this.getInfo();
    setTimeout(() => {
      this.renderImage();
    }, 5000);
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert(t("permNotReqCam"));
      }
    }
  };

  async getInfo() {
    this.setState({
      isReady: false,
    });
    await axios.get("auth/me").then((e) => {
      this.setState({
        user: e.data,
        isReady: true,
        phone: e.data.phone,
        email: e.data.email,
      });
      this.renderImage();
    });
  }

  updateAccount = async () => {
    this.setState({ isReady: false });
    Keyboard.dismiss();
    var formData = new FormData();
    formData.append("phone", this.state.phone);
    formData.append("email", this.state.email);
    await axios.post("auth/update_data", formData).then((e) => {
      this.getInfo();
    });
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.7,
        base64: false,
      });

      if (result.cancelled) {
        return false;
      }

      this.setState({ isReady: false });
      var downpp = null;
      const response = await fetch(result.uri);
      const blob = await response.blob();
      var ref = firebase
        .storage()
        .ref()
        .child("users/user_" + this.state.user.uid + ".jpg");
      ref.put(blob).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (data) => {},
        () => {
          firebase
            .storage()
            .ref("users/user_" + this.state.user.uid + ".jpg")
            .snapshot.ref.getDownloadURL()
            .then(function (downloadURL) {
              downpp = downloadURL;
              this.setState({ isReady: false });
            });
        }
      );
      ref.getDownloadURL().then(async (url) => {
        this.setState({ isReady: false });
        var formData = new FormData();
        formData.append("image", url);
        await axios.post("auth/update_photo", formData).then((e) => {
          this.getInfo();
        });
      });
      this.setState({ isReady: false });
      this.getInfo();
    } catch (e) {
      console.log(e.message);
    }
    this.setState({ isReady: true });
  };

  renderImage() {
    return (
      <Thumbnail
        style={styles.image}
        source={{
          uri: this.state.user.image ?? icon,
        }}
      />
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <StatusBar backgroundColor="#fff" />
        <HeaderDrawer {...this.props} name={t("settings.listitems.accounts")} />
        {this.state.isReady ? (
          <View>
            <View style={styles.header}>
              <View style={customStyle.headerArena}>
                <View style={styles.imagePickerArena}>
                  <View style={styles.imageArena}>
                    {this.state.user.image === null ||
                    this.state.user.image == null ? (
                      <Thumbnail style={styles.image} source={icon} />
                    ) : (
                      this.renderImage()
                    )}
                  </View>
                  <View style={styles.pickerArena}>
                    <Button
                      style={{ padding: 10, marginLeft: 10 }}
                      danger
                      rounded
                      small
                      onPress={this._pickImage}
                    >
                      <Feather name="edit" size={18} color="#fff" />
                    </Button>
                  </View>
                </View>
                <Textpopins
                  style={styles.nameSurname}
                  children={
                    this.state.user.name != null
                      ? this.state.user.name
                      : t("loginregister.programlock.namesurname")
                  }
                />
              </View>
            </View>
            <View style={customStyle.f1}>
              <Content>
                <Form style={styles.form}>
                  <View style={styles.itemStyle}>
                    <Input
                      style={styles.inputstyle}
                      keyboardType="phone-pad"
                      placeholder={t("form.labels.phonenumb")}
                      keyboardShouldPersistTaps="handled"
                      onChangeText={(text) => this.setState({ phone: text })}
                      value={
                        this.state.user != null
                          ? this.state.user.phone
                          : t("form.labels.phonenumb")
                      }
                      defaultValue={
                        this.state.user != null
                          ? this.state.user.phone
                          : t("form.labels.phonenumb")
                      }
                    />
                  </View>
                  <View style={styles.itemStyle}>
                    <Input
                      style={styles.inputstyle}
                      keyboardType="email-address"
                      keyboardShouldPersistTaps="handled"
                      placeholder={t("form.labels.email")}
                      onChangeText={(text) => this.setState({ email: text })}
                      value={
                        this.state.user != null
                          ? this.state.user.email
                          : t("form.labels.phonenumb")
                      }
                      defaultValue={
                        this.state.user != null
                          ? this.state.user.email
                          : t("form.labels.phonenumb")
                      }
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      rounded
                      style={styles.buttonStyle}
                      onPress={() => this.updateAccount()}
                      info
                    >
                      <Textpopins
                        style={styles.buttonText}
                        children={t("actions.submit")}
                      />
                    </Button>
                  </View>
                </Form>
              </Content>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <ActivityIndicator size="large" color="#5C0082" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5C0082",
    height: height / 3.25,
    width: width,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imagePickerArena: {
    position: "relative",
    width: 85,
    height: 85,
    marginTop: Constants.statusBarHeight - 5,
    backgroundColor: "#fff",
    borderRadius: 43,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  imageArena: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  pickerArena: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  nameSurname: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    paddingBottom: 0,
    backgroundColor: "transparent",
    textAlign: "center",
    marginTop: Constants.statusBarHeight / 2,
  },
  content: {
    padding: 0,
    margin: 0,
    marginTop: 60,
    backgroundColor: "#fff",
    width: width,
  },
  form: {
    padding: 0,
    margin: 0,
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
    backgroundColor: "#fff",
    paddingLeft: 10,
    color: "#6d7587",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,.4)",
    borderWidth: 2,
  },
  buttonStyle: {
    paddingHorizontal: 40,
    marginTop: 15,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    color: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 0,
  },
});
