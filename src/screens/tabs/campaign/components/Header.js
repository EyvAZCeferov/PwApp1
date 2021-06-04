import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Textpopins from "../../../../functions/screenfunctions/text";

function Header(props) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        textAlignVertical: "center",
        justifyContent: "center",
        alignContent: "center",
        marginTop: Constants.statusBarHeight - 10,
      }}
    >
      <View style={styles.header}>
        <StatusBar backgroundColor="#ffffff" style="dark" />
        {props.button ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.pop()}
          >
            <Ionicons name="arrow-back" size={24} color="#5C0082" />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              paddingHorizontal: Constants.statusBarHeight / 2,
              paddingVertical: 5,
            }}
          />
        )}
        <Textpopins
          style={[
            styles.text,
            {
              marginLeft: props.titleLeft
                ? Constants.statusBarHeight
                : Constants.statusBarHeight * 2.4,
            },
          ]}
        >
          {props.title}
        </Textpopins>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, { borderColor: "#fff", width: 50 }]}
          ></TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { borderColor: "#fff", width: 50 }]}
          ></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: Constants.statusBarHeight / 3,
  },
  button: {
    paddingHorizontal: Constants.statusBarHeight / 2,
    borderColor: "#5C0082",
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: Constants.statusBarHeight * 2,
  },
  text: {
    color: "rgba(0,0,0,.8)",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: Constants.statusBarHeight * 2.4,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    left: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
