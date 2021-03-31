import React, { useState } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import {Poppins_400Regular, useFonts} from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

export default function Textpopins(props) {

    function getFont(){
        let [fontsLoaded] = useFonts({
            Poppins_400Regular,
        });
        return fontsLoaded;
    }

  function content() {
       let font= getFont()
    if (font) {
      return (
        <Text
          style={[
            {
              fontSize: props.size ? props.size : 18,
              color: props.color ? props.color : "rgba(0,0,0,.8)",
              fontFamily: "Poppins_400Regular",
            },
            props.style ? props.style : null,
          ]}
        >
          {props.children}
        </Text>
      );
    } else {
      return (
        <Text
          style={[
            {
              fontSize: props.size ? props.size : 18,
              color: props.color ? props.color : "rgba(0,0,0,.8)",
            },
            props.style ? props.style : null,
          ]}
        >
          {props.children}
        </Text>
      );
    }
  }

  return content();
}

const styles = StyleSheet.create({
  textContainer: {
    width: width,
  },
});
