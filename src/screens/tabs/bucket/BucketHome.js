import React from "react";
import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import { connect } from "react-redux";
import Horizontalwishlists from "./components/Horizontalwishlists";
import { t } from "../../../functions/lang";
import RenderCategory from "./components/RenderCategory";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");

class BucketHome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar backgroundColor="#fff" style="dark" />
        <View>
          <View style={styles.header}>
            <BucketHeader title={t("bucket.header.tabtitle")} />
          </View>
          <View style={styles.contentArena}>
            <RenderCategory />
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
    removewishlist: (product) =>
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product }),
  };
};
export default connect(null, mapDispatchToProps)(BucketHome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: width,
    height: "15%",
    // marginTop: Constants.statusBarHeight,
  },
  contentArena: {
    width: width,
    height: "82%",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
