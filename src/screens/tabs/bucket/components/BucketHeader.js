import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Textpopins from "../../../../functions/screenfunctions/text";

function BucketHeader(props) {
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
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              paddingHorizontal: Constants.statusBarHeight / 2,
              paddingVertical: 5,
            }}
          />
        )}
        <Textpopins style={styles.text}>{props.title}</Textpopins>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("CartList", {
                checkid: props.checkid,
              })
            }
          >
            <AntDesign name="shoppingcart" size={24} color="black" />
            <Textpopins style={styles.badge}>
              {props.bucketitems.length}
            </Textpopins>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("WishList")}
          >
            <AntDesign name="hearto" size={24} color="black" />
            <Textpopins style={styles.badge}>
              {props.wishitems.length}
            </Textpopins>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    bucketitems: state.bucketitems,
    wishitems: state.wishitems,
  };
};

export default connect(mapStateToProps)(BucketHeader);

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
