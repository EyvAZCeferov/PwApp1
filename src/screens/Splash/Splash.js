import React from "react";
import {View, Image, ImageBackground,Dimensions} from "react-native";
import {StatusBar} from "expo-status-bar";

const {width,height}=Dimensions.get("window");

// const splashIcon = require("../../../assets/icon-ios.png");
const splash = require("../../../assets/splash2.png");
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
                <StatusBar style="dark" backgroundColor="#fff"/>
                <ImageBackground
                    source={splash}
                    defaultSource={splash}
                    style={{width, height}}
                />
            </View>
        );
    }
}
