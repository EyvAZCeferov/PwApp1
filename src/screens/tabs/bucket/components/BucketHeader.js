import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Button, Header, Left, Body, Right } from "native-base";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { StatusBar } from "expo-status-bar";
const categories = [
  {
    id: 1,
    image: "https://picsum.photos/149",
    name: "Category Name 1",
  },
  {
    id: 2,
    image: "https://picsum.photos/149",
    name: "Category Name 2",
  },
  {
    id: 3,
    image: "https://picsum.photos/149",
    name: "Category Name 3",
  },
  {
    id: 4,
    image: "https://picsum.photos/149",
    name: "Category Name 4",
    top_cat: 3,
  },
  {
    id: 5,
    image: "https://picsum.photos/149",
    name: "Category Name 5",
  },
  {
    id: 6,
    image: "https://picsum.photos/149",
    name: "Category Name 6",
    top_cat: 8,
  },
  {
    id: 7,
    image: "https://picsum.photos/149",
    name: "Category Name 7",
  },
  {
    id: 8,
    image: "https://picsum.photos/149",
    name: "Category Name 8",
  },
  {
    id: 9,
    image: "https://picsum.photos/149",
    name: "Category Name 9",
  },
  {
    id: 10,
    image: "https://picsum.photos/149",
    name: "Category Name 10",
  },
];

function BucketHeader(props) {
  const navigation = useNavigation();

  function back() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.header}>
      <Header
        backgroundColor="#fff"
        androidStatusBarColor="#fff"
        style={{
          backgroundColor: "#fff",
          borderBottomColor: "#7c9d32",
          borderBottomWidth: 2,
        }}
      >
        <StatusBar backgroundColor="#fff" style="dark" />
        {props.button && props.button === true ? (
          <Left style={styles.center}>
            <TouchableOpacity onPress={() => back()} style={styles.center}>
              <AntDesign name="left" size={24} color="#7c9d32" />
            </TouchableOpacity>
          </Left>
        ) : (
          <Left style={styles.center} />
        )}
        <Body style={styles.center}>
          <Textpopins style={styles.headerTitle} children={props.title} />
        </Body>
        <Right style={[styles.headerRight, styles.center]}>
          <Button transparent onPress={() => navigation.navigate("CartList")}>
            <AntDesign name="shoppingcart" size={24} color="#000" />
            <Text
              style={[
                styles.center,
                {
                  color: "#7c9d32",
                  fontSize: 15,
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: 6,
                  right: 8,
                },
              ]}
              children={props.bucketitems.length}
            />
          </Button>
          <Button transparent onPress={() => navigation.navigate("WishList")}>
            <AntDesign name="hearto" size={24} color="black" />
            <Text
              style={[
                styles.center,
                {
                  color: "#7c9d32",
                  fontSize: 15,
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: 6,
                  right: 8,
                },
              ]}
              children={props.wishitems.length}
            />
          </Button>
        </Right>
      </Header>

      <View style={[styles.bottomHeader, styles.center]}>
        <View style={styles.inputArena}>
          <TextInput
            placeholder={t("bucket.header.search")}
            placeholderTextColor={"#7c9d32"}
            style={{
              width: "98%",
              height: 45,
              borderColor: "#7c9d32",
              borderWidth: 1,
              fontSize: 17,
              paddingLeft: 5,
            }}
          />
          <Button
            style={[
              styles.button,
              { position: "absolute", right: 0, zIndex: 999 },
            ]}
            success
          >
            <MaterialIcons color="#fff" size={24} name="search" />
          </Button>
        </View>
      </View>
    </SafeAreaView>
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
    width: width,
    height: "100%",
    flexDirection: "column",
    borderColor: "transparent",
    borderWidth: 0,
    // marginTop: Constants.statusBarHeight,
  },
  bottomHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    borderColor: "transparent",
    borderWidth: 0,
  },
  inputArena: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    borderColor: "transparent",
    borderWidth: 0,
  },
  button: {
    paddingHorizontal: 10,
    borderColor: "transparent",
    borderWidth: 0,
  },
  headerTitle: {
    color: "#7c9d32",
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: Constants.statusBarHeight * 2,
    borderColor: "transparent",
    borderWidth: 0,
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginRight: -Constants.statusBarHeight,
    borderColor: "transparent",
    borderWidth: 0,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    borderColor: "transparent",
    borderWidth: 0,
  },
});
