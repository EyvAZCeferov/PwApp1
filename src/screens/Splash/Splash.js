import React from "react";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

const splashIcon = require("../../../assets/icon-ios.png");
export default class Splash extends React.Component {
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <StatusBar style="dark" backgroundColor="#fff" />
        <Image
          source={splashIcon}
          defaultSource={splashIcon}
          style={{ width: 140, height: 140 }}
        />
      </View>
    );
  }
}
