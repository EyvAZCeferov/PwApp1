import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import BucketHeader from "./components/BucketHeader";
import { t } from "../../../functions/lang";
import { List, ListItem } from "native-base";
import { connect } from "react-redux";
import Constants from "expo-constants";
// import wishitems from "../../../functions/reducrers/wishlistitems";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");

function WishList(props) {

  function renderBucket({ item, index }) {
    return (
      <ListItem style={{ width: "100%", height: 90 }}>
      <Left>
      <AntDesign name="user" size={24} color="#7c9d32" />
      </Left>
      <Body>
        <Textpopins children={item.name} />
        </Body>
        <Right>
        <Button>
        Add
        </Button>
        </Right>
      </ListItem>
    );
  }

  return (
    <View style={[styles.container, styles.center]}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <View>
        <View style={styles.header}>
          <BucketHeader
            button={true}
            title={t("bucket.header.wishList.title")}
          />
        </View>
        <View style={[styles.center, styles.contentArena]}>
          {props.wishitems && props.wishitems.length > 0 ? (
            <List
              style={{
                width: width,
                height: "100%",
              }}
            >
              <FlatList
                data={props.wishitems}
                renderItem={renderBucket}
                keyExtractor={(item, index) => index.toString()}
              />
            </List>
          ) : (
            <Textpopins
              children={t("actions.noResult")}
              style={styles.noResult}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    wishitems: state.wishitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addtoCard: (product) => dispatch({ type: "bucketitems/ADD_TO_CART", payload: product }),
    removewishlist: (product) =>
      dispatch({ type: "wishitems/REMOVE_FROM_WISHLIST", payload: product }),
    addWishList: (product) =>
      dispatch({ type: "wishitems/ADD_TO_WISHLIST", payload: product }),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(WishList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: width,
    height: "20%",
    marginTop: Constants.statusBarHeight,
  },
  contentArena: {
    width: width,
    height: "80%",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  noResult: {
    color: "#D50000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
});
